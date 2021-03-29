import { lex } from "../src/lex.ts";
import { TokenType } from "../src/types.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.90.0/testing/asserts.ts";

Deno.test("should return an array", () => {
  assertEquals(lex(""), []);
});

// NUMBERS

Deno.test("should tokenize an unsigned int", () => {
  const input = `123`;
  const result = [{ type: TokenType.NUMBER, value: 123 }];
  assertEquals(lex(input), result);
});

Deno.test("should tokenize signed ints", () => {
  const input = `+123 -456`;
  const result = [
    { type: TokenType.NUMBER, value: 123 },
    { type: TokenType.NUMBER, value: -456 },
  ];
  assertEquals(lex(input), result);
});

Deno.test("should tokenize floats", () => {
  const input = `.12 -34. +5.6 .7e2 -8.E3 17e8 +90.1E+4 2.45e-67`;
  const result = [
    { type: TokenType.NUMBER, value: 0.12 },
    { type: TokenType.NUMBER, value: -34.0 },
    { type: TokenType.NUMBER, value: 5.6 },
    { type: TokenType.NUMBER, value: 0.7e2 },
    { type: TokenType.NUMBER, value: -8.e3 },
    { type: TokenType.NUMBER, value: 17e8 },
    { type: TokenType.NUMBER, value: 90.1e4 },
    { type: TokenType.NUMBER, value: 2.45e-67 },
  ];
  assertEquals(lex(input), result);
});

Deno.test("shouldn't give false positives when tokenizing floats", () => {
  const input = `4.5en 6e+-`;
  const result = [
    { type: TokenType.NUMBER, value: 4.5 },
    { type: TokenType.SYMBOL, value: "en", quoted: false },
    { type: TokenType.NUMBER, value: 6 },
    { type: TokenType.SYMBOL, value: "e+-", quoted: false },
  ];
  assertEquals(lex(input), result);
});

Deno.test("should fail to tokenize a lone full-stop", () => {
  const input1 = `.`;
  const input2 = `+.`;
  const input3 = `-.`;
  assertThrows(() => lex(input1), SyntaxError, '"."');
  assertThrows(() => lex(input2), SyntaxError, '"."');
  assertThrows(() => lex(input3), SyntaxError, '"."');
});

// SYMBOLS

Deno.test("should tokenize a symbol", () => {
  const input = `+a1 `;
  const result = [{ type: TokenType.SYMBOL, value: "+a1", quoted: false }];
  assertEquals(lex(input), result);
});

Deno.test("should tokenize a quoted symbol", () => {
  const input = `'ab-c`;
  const result = [{ type: TokenType.SYMBOL, value: "ab-c", quoted: true }];
  assertEquals(lex(input), result);
});

// STRINGS

Deno.test("should tokenize a string", () => {
  const input = `"Hello"`;
  const result = [{ type: TokenType.STRING, value: "Hello" }];
  assertEquals(lex(input), result);
});

Deno.test("should tokenize a quoted string", () => {
  const input = `'"Hi there"`;
  const result = [{ type: TokenType.STRING, value: "Hi there" }];
  assertEquals(lex(input), result);
});

Deno.test("should tokenize an escaped string", () => {
  const input = `"Hel\\"lo\n"`;
  const result = [
    { type: TokenType.STRING, value: `Hel\\"lo\n` },
  ];

  assertEquals(lex(input), result);
});

// LISTS

Deno.test("should tokenize a list of symbols", () => {
  const input = "(+ a b)";
  const result = [
    { type: TokenType.OPENING_PARENTHESIS, quoted: false },
    { type: TokenType.SYMBOL, value: "+", quoted: false },
    { type: TokenType.SYMBOL, value: "a", quoted: false },
    { type: TokenType.SYMBOL, value: "b", quoted: false },
    { type: TokenType.CLOSING_PARENTHESIS },
  ];
  assertEquals(lex(input), result);
});

Deno.test("should tokenize a quoted list", () => {
  const input = "'(+ a b)";
  const result = [
    { type: TokenType.OPENING_PARENTHESIS, quoted: true },
    { type: TokenType.SYMBOL, value: "+", quoted: false },
    { type: TokenType.SYMBOL, value: "a", quoted: false },
    { type: TokenType.SYMBOL, value: "b", quoted: false },
    { type: TokenType.CLOSING_PARENTHESIS },
  ];
  assertEquals(lex(input), result);
});

Deno.test("should fail to tokenize quoted closing paren", () => {
  const input = "(+ a b ')";
  assertThrows(() => lex(input), SyntaxError, "quote");
});

// COMMENTS

Deno.test("should tokenize a comment", () => {
  const input = `a ; This is a comment
  b`;
  const result = [
    { type: TokenType.SYMBOL, value: "a", quoted: false },
    { type: TokenType.COMMENT, value: " This is a comment" },
    { type: TokenType.SYMBOL, value: "b", quoted: false },
  ];
  assertEquals(lex(input), result);
});

Deno.test("should fail to tokenize quoted comment", () => {
  const input = "'; ...";
  assertThrows(() => lex(input), SyntaxError, "quote");
});

// WHITESPACE

Deno.test("should ignore whitespace completely", () => {
  const input = `
  \t`;
  const result = [];
  assertEquals(lex(input), result);
});

Deno.test("should fail to tokenize quoted whitespace", () => {
  const input = "a ' ";
  assertThrows(() => lex(input), SyntaxError, "quote");
});

// UNRECOGNIZED

Deno.test("should fail to tokenize unrecognized char", () => {
  const input = "ab 😀";
  assertThrows(() => lex(input), SyntaxError, "unrecognized");
});

// MORE COMPLEX EXPRESSION

Deno.test("should tokenize a fairly complex expression", () => {
  const input = `; What follows is an s-expression.
  (let ((x -1) (y 2.e3)) (+ x y (first '(3 'z "Hi"))))
  `;

  const result = [
    { type: TokenType.COMMENT, value: " What follows is an s-expression." },
    { type: TokenType.OPENING_PARENTHESIS, quoted: false },
    { type: TokenType.SYMBOL, value: "let", quoted: false },
    { type: TokenType.OPENING_PARENTHESIS, quoted: false },
    { type: TokenType.OPENING_PARENTHESIS, quoted: false },
    { type: TokenType.SYMBOL, value: "x", quoted: false },
    { type: TokenType.NUMBER, value: -1 },
    { type: TokenType.CLOSING_PARENTHESIS },
    { type: TokenType.OPENING_PARENTHESIS, quoted: false },
    { type: TokenType.SYMBOL, value: "y", quoted: false },
    { type: TokenType.NUMBER, value: 2.e3 },
    { type: TokenType.CLOSING_PARENTHESIS },
    { type: TokenType.CLOSING_PARENTHESIS },
    { type: TokenType.OPENING_PARENTHESIS, quoted: false },
    { type: TokenType.SYMBOL, value: "+", quoted: false },
    { type: TokenType.SYMBOL, value: "x", quoted: false },
    { type: TokenType.SYMBOL, value: "y", quoted: false },
    { type: TokenType.OPENING_PARENTHESIS, quoted: false },
    { type: TokenType.SYMBOL, value: "first", quoted: false },
    { type: TokenType.OPENING_PARENTHESIS, quoted: true },
    { type: TokenType.NUMBER, value: 3 },
    { type: TokenType.SYMBOL, value: "z", quoted: true },
    { type: TokenType.STRING, value: "Hi" },
    { type: TokenType.CLOSING_PARENTHESIS },
    { type: TokenType.CLOSING_PARENTHESIS },
    { type: TokenType.CLOSING_PARENTHESIS },
    { type: TokenType.CLOSING_PARENTHESIS },
  ];

  assertEquals(lex(input), result);
});
