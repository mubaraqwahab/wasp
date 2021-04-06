import { defaultEnv, isSpecialForm } from "./environment.ts";
import { Environment, Node, NodeType, UAtom, USExpression } from "./types.ts";

const s = JSON.stringify;

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
      if (node.quoted) {
        return node.children.map((n) => evaluate(n, true));
      } else {
        const firstNode = node.children[0];
        if (firstNode.type === NodeType.SYMBOL) {
          if (firstNode.quoted) {
            // must not be quoted
            throw new TypeError();
          } else if (isSpecialForm(firstNode.value)) {
            return evalSpecialForm(node, env);
          } else {
            const fn = firstNode.value;
            const args = node.children.slice(1);
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

function evalSpecialForm(node: Node, env: Environment): USExpression {
  // TODO (remove undefined from signature?)
  return undefined;
}

/*
undefined => <nothing>
null => nil
empty array => nil
*/

export { evaluate };
