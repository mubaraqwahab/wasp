import { evaluate } from "./evaluate.ts";
import { Node, NodeType } from "./types.ts";

const ast: Node = {
  type: NodeType.PROGRAM,
  children: [
    {
      type: NodeType.LIST,
      quoted: false,
      children: [
        { type: NodeType.SYMBOL, value: "if", quoted: false },
        {
          type: NodeType.LIST,
          quoted: false,
          children: [
            { type: NodeType.SYMBOL, value: ">", quoted: false },
            { type: NodeType.NUMBER, value: 5 },
            { type: NodeType.NUMBER, value: 8 },
          ],
        },
        { type: NodeType.STRING, value: "5 is greater than 8" },
        {
          type: NodeType.LIST,
          quoted: false,
          children: [
            { type: NodeType.SYMBOL, value: "if", quoted: false },
            {
              type: NodeType.LIST,
              quoted: false,
              children: [
                { type: NodeType.SYMBOL, value: "<", quoted: false },
                { type: NodeType.NUMBER, value: 5 },
                { type: NodeType.NUMBER, value: 8 },
              ],
            },
            { type: NodeType.STRING, value: "5 is less than 8" },
            { type: NodeType.STRING, value: "5 is equal to 8" },
          ],
        },
      ],
    },
  ],
};

console.log(evaluate(ast));
