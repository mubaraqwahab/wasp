import { evaluate } from "../src/evaluate.ts";
import { NodeType } from "../src/types.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.90.0/testing/asserts.ts";

Deno.test("should fall back to returning a primitive numeric value", () => {
  const ast = {
    type: NodeType.PROGRAM,
    children: [{ type: NodeType.NUMBER, value: 2 }],
  };
  assertEquals(evaluate(ast), 2);
});

Deno.test("should fall back to returning a primitive string value", () => {
  const ast = { type: NodeType.STRING, value: "Hello" };
  assertEquals(evaluate(ast), "Hello");
});

Deno.test("should be able to evaluate a single expression", () => {
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

Deno.test("should be able to evaluate a nested expression", () => {
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

Deno.test("should be able to lookup identifiers in the environment", () => {
  const ast = { type: NodeType.SYMBOL, name: "pi", quoted: false };
  assertEquals(evaluate(ast), Math.PI);
});

Deno.test("should be able to highest number in a range", () => {
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
