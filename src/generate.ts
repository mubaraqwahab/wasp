import { Node, NodeType } from "./types.ts";

const s = JSON.stringify;
const specialForms = ["let", "if", "defun"];
const infixOperators: { [key: string]: string } = {
  "+": "+",
  "-": "-",
  "*": "*",
  "/": "/",
  "<": "<",
  ">": ">",
  "=": "===",
};

function generate(node: Node): string {
  switch (node.type) {
    case NodeType.NUMBER:
    case NodeType.STRING:
      return s(node.value);
    case NodeType.SYMBOL:
      if (node.quoted) {
        return `Symbol.for(${s(node.value)})`;
      } else {
        // variables
      }
      break;
    case NodeType.LIST:
      if (node.quoted) {
        return `[${node.children.map(generate).join(",")}]`;
      } else {
        const firstNode = node.children[0];
        if (firstNode.type === NodeType.SYMBOL) {
          const fn = firstNode.value, args = node.children.slice(1);
          if (specialForms.includes(fn)) {
            return generateSpecialForm(fn, args);
          } else if (fn in infixOperators) {
            return `(${args.map(generate).join(infixOperators[fn])})`;
          } else {
            return `${fn}(${args.map(generate).join(",")})`;
          }
        }
      }
      break;
    case NodeType.PROGRAM:
      return node.children.map(generate).join(";");
    default:
      break;
  }

  return "";
}

function generateSpecialForm(name: string, args: Node[]): string {
  const g = generate;
  if (name === "if") {
    // (if cond ifForm elseForm)
    // -> cond ? ifForm : elseForm
    const [cond, ifForm, elseForm] = args;
    return `${g(cond)}?${g(ifForm)}:${g(elseForm)}`;
  }

  return "";
}

export { generate };
