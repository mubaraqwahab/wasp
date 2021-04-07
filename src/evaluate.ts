import { defaultEnv } from "./environment.ts";
import { Environment, Node, NodeType, UAtom, USExpression } from "./types.ts";

const s = JSON.stringify;
const specialForms = ["let", "if", "defun"];

function evaluate(node: Node, inQuotedList = false): USExpression {
  const env = { ...defaultEnv };
  switch (node.type) {
    case NodeType.NUMBER:
    case NodeType.STRING:
      return node.value;
    case NodeType.SYMBOL:
      if (node.quoted || inQuotedList) {
        return Symbol.for(node.value);
      } else if (node.value in env.variables) {
        return env.variables[node.value];
      } else {
        throw new ReferenceError(`${s(node.value)} is not defined`);
      }
    case NodeType.LIST:
      // What if list is empty?
      if (node.quoted) {
        return node.children.map((n) => evaluate(n, true));
      } else {
        const firstNode = node.children[0];
        if (firstNode.type === NodeType.SYMBOL) {
          const fn = firstNode.value;
          const args = node.children.slice(1);
          if (firstNode.quoted) {
            // must not be quoted
            throw new TypeError();
          } else if (specialForms.includes(fn)) {
            return evalSpecialForm({ name: fn, args, env });
          } else {
            return env.functions[fn](
              ...args.map((n) => evaluate(n, inQuotedList)),
            );
          }
        } else {
          // expected symbol
          throw new TypeError();
        }
      }
    case NodeType.COMMENT:
      return undefined;
    case NodeType.PROGRAM:
      return node.children.map((n) => evaluate(n)).pop();
    default:
      // unknown node type
      throw new SyntaxError();
  }
}

function evalSpecialForm(
  { name, args, env }: { name: string; args: Node[]; env: Environment },
): USExpression {
  if (name === "if") {
    // (if cond ifForm falseValue)
    // cond is considered true if it isn't nil
    if (args.length !== 3) throw new Error(); // only 3 args allowed

    const [cond, ifForm, elseForm] = args;
    const condValue = evaluate(cond);
    // TODO: normalize these values in evaluate
    if (condValue === undefined || condValue === false) {
      return evaluate(elseForm);
    } else {
      return evaluate(ifForm);
    }
  }
  // TODO (remove undefined from signature?)
  return undefined;
}

/*
undefined => <nothing>
null => nil
empty array => nil
*/

export { evaluate };
