import { parse } from "../src/parse.ts";
import { Node, NodeType, Token, TokenType } from "../src/types.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.90.0/testing/asserts.ts";

Deno.test("should parse a number token", () => {
  const tokens: Token[] = [{ type: TokenType.NUMBER, value: 2 }];
  const ast: Node = {
    type: NodeType.PROGRAM,
    children: [{ type: NodeType.NUMBER, value: 2 }],
  };
  assertEquals(parse(tokens), ast);
});

Deno.test("should parse symbol tokens", () => {
  const tokens: Token[] = [
    { type: TokenType.SYMBOL, value: "a", quoted: false },
    { type: TokenType.SYMBOL, value: "b", quoted: true },
  ];
  const ast: Node = {
    type: NodeType.PROGRAM,
    children: [
      { type: NodeType.SYMBOL, value: "a", quoted: false },
      { type: NodeType.SYMBOL, value: "b", quoted: true },
    ],
  };
  assertEquals(parse(tokens), ast);
});

Deno.test("should parse a string token", () => {
  const tokens: Token[] = [{ type: TokenType.STRING, value: "hello" }];
  const ast: Node = {
    type: NodeType.PROGRAM,
    children: [{ type: NodeType.STRING, value: "hello" }],
  };
  assertEquals(parse(tokens), ast);
});

Deno.test("should parse tokens for a simple list", () => {
  const tokens: Token[] = [
    { type: TokenType.OPENING_PARENTHESIS, quoted: false },
    { type: TokenType.SYMBOL, value: "+", quoted: false },
    { type: TokenType.NUMBER, value: 2 },
    { type: TokenType.NUMBER, value: 3 },
    { type: TokenType.CLOSING_PARENTHESIS },
  ];
  const ast: Node = {
    type: NodeType.PROGRAM,
    children: [
      {
        type: NodeType.LIST,
        quoted: false,
        children: [
          { type: NodeType.SYMBOL, value: "+", quoted: false },
          { type: NodeType.NUMBER, value: 2 },
          { type: NodeType.NUMBER, value: 3 },
        ],
      },
    ],
  };
  assertEquals(parse(tokens), ast);
});

Deno.test("should parse tokens for a nested list", () => {
  // (+ 2 3
  //   (first (7.8 3.e9)) ; expect to be 7.8
  //   4)
  const tokens: Token[] = [
    { type: TokenType.OPENING_PARENTHESIS, quoted: false },
    { type: TokenType.SYMBOL, value: "+", quoted: false },
    { type: TokenType.NUMBER, value: 2 },
    { type: TokenType.NUMBER, value: 3 },
    { type: TokenType.OPENING_PARENTHESIS, quoted: false },
    { type: TokenType.SYMBOL, value: "first", quoted: false },
    { type: TokenType.OPENING_PARENTHESIS, quoted: true },
    { type: TokenType.NUMBER, value: 7.8 },
    { type: TokenType.NUMBER, value: 3.e9 },
    { type: TokenType.CLOSING_PARENTHESIS },
    { type: TokenType.CLOSING_PARENTHESIS },
    { type: TokenType.COMMENT, value: " expect to be 7.8" },
    { type: TokenType.NUMBER, value: 4 },
    { type: TokenType.CLOSING_PARENTHESIS },
  ];
  const ast: Node = {
    type: NodeType.PROGRAM,
    children: [
      {
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
              { type: NodeType.SYMBOL, value: "first", quoted: false },
              {
                type: NodeType.LIST,
                quoted: true,
                children: [
                  { type: NodeType.NUMBER, value: 7.8 },
                  { type: NodeType.NUMBER, value: 3.e9 },
                ],
              },
            ],
          },
          { type: NodeType.NUMBER, value: 4 },
        ],
      },
    ],
  };
  assertEquals(parse(tokens), ast);
});

Deno.test("should fail to parse an unrecognized token", () => {
  const tokens = [
    { type: TokenType.NUMBER, value: 4 },
    { type: "." },
  ];
  assertThrows(() => parse(tokens as Token[]), SyntaxError, "unrecognized");
});
