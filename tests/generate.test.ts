import { generate } from "../src/generate.ts";
import { Node, NodeType } from "../src/types.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.90.0/testing/asserts.ts";

Deno.test("should generate a JS number", () => {
  const ast: Node = { type: NodeType.NUMBER, value: -30.e+9 };
  assertEquals(generate(ast), "" + -30.e+9);
});

Deno.test("should generate a JS string", () => {
  const ast: Node = { type: NodeType.STRING, value: "Hi there" };
  assertEquals(generate(ast), `"Hi there"`);
});

Deno.test("should generate a JS symbol", () => {
  const ast: Node = { type: NodeType.SYMBOL, value: "ab,cd", quoted: true };
  assertEquals(generate(ast), `Symbol.for("ab,cd")`);
});

Deno.test("should generate a JS array", () => {
  const ast: Node = {
    type: NodeType.LIST,
    quoted: true,
    children: [
      { type: NodeType.NUMBER, value: .89 },
      { type: NodeType.STRING, value: "random string" },
      { type: NodeType.SYMBOL, value: "qwerty", quoted: true },
    ],
  };
  assertEquals(
    generate(ast),
    `[${"" + .89},"random string",Symbol.for("qwerty")]`,
  );
});

Deno.test("should generate a JS function call", () => {
  const ast: Node = {
    type: NodeType.LIST,
    quoted: false,
    children: [
      { type: NodeType.SYMBOL, value: "avg", quoted: false },
      { type: NodeType.NUMBER, value: 5 },
      { type: NodeType.NUMBER, value: 10 },
      { type: NodeType.NUMBER, value: 13 },
    ],
  };
  assertEquals(generate(ast), `avg(5,10,13)`);
});

Deno.test("should generate a JS conditional expression", () => {
  const ast: Node = {
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
              { type: NodeType.SYMBOL, value: "=", quoted: false },
              { type: NodeType.NUMBER, value: 5 },
              { type: NodeType.NUMBER, value: 8 },
            ],
          },
          { type: NodeType.STRING, value: "5 is equal to 8" },
          { type: NodeType.STRING, value: "5 is less than 8" },
        ],
      },
    ],
  };
  assertEquals(
    generate(ast),
    `5>8?"5 is greater than 8":5===8?"5 is equal to 8":"5 is less than 8"`,
  );
});
