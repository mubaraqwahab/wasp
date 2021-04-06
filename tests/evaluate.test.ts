import { evaluate } from "../src/evaluate.ts";
import { Node, NodeType } from "../src/types.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.90.0/testing/asserts.ts";

Deno.test("can evaluate a number", () => {
  const ast: Node = { type: NodeType.NUMBER, value: 2 };
  assertEquals(evaluate(ast), 2);
});

Deno.test("can evaluate a string", () => {
  const ast: Node = { type: NodeType.STRING, value: "Hello" };
  assertEquals(evaluate(ast), "Hello");
});

Deno.test("can evaluate a symbol", () => {
  const ast: Node = { type: NodeType.SYMBOL, value: "pi", quoted: false };
  assertEquals(evaluate(ast), Math.PI);
});

Deno.test("can evaluate a quoted symbol", () => {
  const ast: Node = { type: NodeType.SYMBOL, value: "abc", quoted: true };
  assertEquals(evaluate(ast), Symbol.for("abc"));
});

Deno.test("can evaluate a list", () => {
  /* (+ 2 3) */
  const ast: Node = {
    type: NodeType.PROGRAM,
    children: [{
      type: NodeType.LIST,
      quoted: false,
      children: [
        { type: NodeType.SYMBOL, value: "+", quoted: false },
        { type: NodeType.NUMBER, value: 2 },
        { type: NodeType.NUMBER, value: 3 },
      ],
    }],
  };
  assertEquals(evaluate(ast), 5);
});

Deno.test("can evaluate a nested list", () => {
  /* (+ 2 3 (- 4 5)) */
  const ast: Node = {
    type: NodeType.LIST,
    quoted: false,
    children: [
      { type: NodeType.SYMBOL, value: "+", quoted: false },
      { type: NodeType.NUMBER, value: 2 },
      { type: NodeType.NUMBER, value: 3 },
      {
        type: NodeType.LIST,
        quoted: false,
        children: [
          { type: NodeType.SYMBOL, value: "-", quoted: false },
          { type: NodeType.NUMBER, value: 4 },
          { type: NodeType.NUMBER, value: 5 },
        ],
      },
    ],
  };
  assertEquals(evaluate(ast), 4);
});

Deno.test("can evaluate a quoted list", () => {
  /* '(2.0 -3 10e-9) */
  const ast: Node = {
    type: NodeType.LIST,
    quoted: true,
    children: [
      { type: NodeType.NUMBER, value: 2.0 },
      { type: NodeType.NUMBER, value: -3 },
      { type: NodeType.NUMBER, value: 10e-9 },
    ],
  };
  assertEquals(evaluate(ast), [2.0, -3, 10e-9]);
});

Deno.test("can ignore an comment", () => {
  const ast: Node = {
    type: NodeType.COMMENT,
    value: "hey there!",
  };
  assertEquals(evaluate(ast), undefined);
});

Deno.test("can evaluate an empty program", () => {
  const ast: Node = {
    type: NodeType.PROGRAM,
    children: [],
  };
  assertEquals(evaluate(ast), undefined);
});

Deno.test("can evaluate type", () => {
  /* (type '(type 'qwe)) */
  const ast: Node = {
    type: NodeType.PROGRAM,
    children: [
      {
        type: NodeType.LIST,
        quoted: false,
        children: [
          { type: NodeType.SYMBOL, value: "type", quoted: false },
          {
            type: NodeType.LIST,
            quoted: true,
            children: [
              { type: NodeType.SYMBOL, value: "type", quoted: false },
              { type: NodeType.SYMBOL, value: "qwe", quoted: true },
            ],
          },
        ],
      },
    ],
  };
  assertEquals(evaluate(ast), "list");
});

Deno.test("can evaluate if special form", () => {
  /*
    (if (> 5 8)
        "5 is greater than 8"
      (if (< 5 8)
          "5 is less than 8"
        ("5 is equal to 8")))
  */
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
      },
    ],
  };
  assertEquals(evaluate(ast), "5 is less than 8");
});
