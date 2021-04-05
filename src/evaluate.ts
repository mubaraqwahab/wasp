import { defaultEnv } from "./environment.ts";
import { Environment, Node, NodeType } from "./types.ts";

function evaluate(node: Node): unknown {
  const env = { ...defaultEnv, ...{} };
  switch (node.type) {
    case NodeType.NUMBER:
    case NodeType.STRING:
      return node.value;
    case NodeType.SYMBOL:
      if (node.quoted) return Symbol(node.value);
      else if (node.value in env.symbols) {
        return env.symbols[node.value];
      } else {
        throw new ReferenceError(`${node.value} is not defined`);
      }

    case NodeType.PROGRAM:
      return node.children!.map(evaluate).pop();
    case NodeType.LIST:
      break;
  }
}

/*
undefined => nil
empty array => nil
*/

export { evaluate };
