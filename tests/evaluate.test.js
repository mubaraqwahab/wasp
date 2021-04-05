import { evaluate } from "../src/evaluate.ts";
import { NodeType } from "../src/types.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.90.0/testing/asserts.ts";

Deno.test("can evaluate a number", () => {
  const ast = { type: NodeType.NUMBER, value: 2 };
  assertEquals(evaluate(ast), 2);
});

Deno.test("can evaluate a string", () => {
  const ast = { type: NodeType.STRING, value: "Hello" };
  assertEquals(evaluate(ast), "Hello");
});

Deno.test("can evaluate a symbol", () => {
  const ast = { type: NodeType.SYMBOL, value: "pi", quoted: false };
  assertEquals(evaluate(ast), Math.PI);
});

Deno.test("can evaluate a quoted symbol", () => {
  const ast = { type: NodeType.SYMBOL, value: "abc", quoted: true };
  assertEquals(evaluate(ast), Symbol.for("abc"));
});

Deno.test("can evaluate a list", () => {
  const ast = {
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
  const ast = {
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
  const ast = {
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
  const ast = {
    type: NodeType.COMMENT,
    value: "hey there!",
  };
  assertEquals(evaluate(ast), undefined);
});

Deno.test("can evaluate an empty program", () => {
  const ast = {
    type: NodeType.PROGRAM,
    children: [],
  };
  assertEquals(evaluate(ast), undefined);
});
