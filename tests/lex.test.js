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

// Deno.test("should tokenize an escaped string", () => {
//   const input = `"Hel\\"lo"`;
//   const result = [
//     { type: TokenType.STRING, value: `Hel\\"lo` },
//   ];

//   assertEquals(lex(input), result);
// });

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

// // Exercise 1 - Begin
// Deno.test("should correctly tokenize a single digit", () => {
//   const input = "2";
//   const result = [{ type: "Number", value: 2 }];

//   expect(tokenize(input)).toEqual(result);
// });

// Deno.test("should be able to handle single numbers in expressions", () => {
//   const input = "(1 2)";

//   const result = [
//     { type: "Parenthesis", value: "(" },
//     { type: "Number", value: 1 },
//     { type: "Number", value: 2 },
//     { type: "Parenthesis", value: ")" },
//   ];

//   expect(tokenize(input)).toEqual(result);
// });

// Deno.test("should be able to handle single letters in expressions", () => {
//   const input = "(a b)";

//   const result = [
//     { type: "Parenthesis", value: "(" },
//     { type: "Name", value: "a" },
//     { type: "Name", value: "b" },
//     { type: "Parenthesis", value: ")" },
//   ];

//   expect(tokenize(input)).toEqual(result);
// });
// // Exercise 1: End

// Deno.test("should be able to handle multiple-digit numbers", () => {
//   const input = "(11 22)";

//   const result = [
//     { type: "Parenthesis", value: "(" },
//     { type: "Number", value: 11 },
//     { type: "Number", value: 22 },
//     { type: "Parenthesis", value: ")" },
//   ];

//   expect(tokenize(input)).toEqual(result);
// });

// // Exercise 2 Begin
// Deno.test("should correctly tokenize a simple expression", () => {
//   const input = "(add 2 3)";
//   const result = [
//     { type: "Parenthesis", value: "(" },
//     { type: "Name", value: "add" },
//     { type: "Number", value: 2 },
//     { type: "Number", value: 3 },
//     { type: "Parenthesis", value: ")" },
//   ];

//   expect(tokenize(input)).toEqual(result);
// });

// Deno.test("should ignore whitespace", () => {
//   const input = "   (add    2 3)";
//   const result = [
//     { type: "Parenthesis", value: "(" },
//     { type: "Name", value: "add" },
//     { type: "Number", value: 2 },
//     { type: "Number", value: 3 },
//     { type: "Parenthesis", value: ")" },
//   ];

//   expect(tokenize(input)).toEqual(result);
// });
// // Exercise 2 End

// Deno.test("should know about strings", () => {
//   const input = '(log "hello" "world")';
//   const result = [
//     { type: "Parenthesis", value: "(" },
//     { type: "Name", value: "log" },
//     { type: "String", value: "hello" },
//     { type: "String", value: "world" },
//     { type: "Parenthesis", value: ")" },
//   ];

//   expect(tokenize(input)).toEqual(result);
// });
