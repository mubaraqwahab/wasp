import { lex } from "../src/lex.ts";
import { TokenType } from "../src/types.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.90.0/testing/asserts.ts";

Deno.test("should return an array", () => {
  assertEquals(lex(""), []);
});

Deno.test("can tokenize a pair of parentheses", () => {
  const input = "()";
  const result = [
    { type: TokenType.OPENING_PARENTHESIS, quoted: false },
    { type: TokenType.CLOSING_PARENTHESIS },
  ];

  assertEquals(lex(input), result);
});

Deno.test("can tokenize a string", () => {
  const input = `"Hello"`;
  const result = [{ type: TokenType.STRING, value: "Hello", quoted: false }];

  assertEquals(lex(input), result);
});

// Deno.test("can tokenize an escaped string", () => {
//   const input = `"Hel\\"lo"`;
//   const result = [
//     { type: TokenType.STRING, value: `Hel\\"lo`, quoted: false },
//   ];

//   assertEquals(lex(input), result);
// });

Deno.test("can tokenize a symbol", () => {
  const input = `+a1 `;
  const result = [{ type: TokenType.SYMBOL, value: "+a1", quoted: false }];

  assertEquals(lex(input), result);
});

Deno.test("can tokenize a quoted atom", () => {
  const input1 = `'abc`;
  const input2 = `'"Hi there"`;

  const result1 = [{ type: TokenType.SYMBOL, value: "abc", quoted: true }];
  const result2 = [{
    type: TokenType.STRING,
    value: "Hi there",
    quoted: true,
  }];

  assertEquals(lex(input1), result1);
  assertEquals(lex(input2), result2);
});

Deno.test("should ignore whitespace completely", () => {
  const input = "                  ";
  const result = [];

  assertEquals(lex(input), result);
});

Deno.test("should fail to tokenize quoted closing paren", () => {
  const input = "(+ a b ')";
  assertThrows(() => lex(input), SyntaxError, "quote");
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
