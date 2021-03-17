const LETTER = /[a-zA-Z]/;
const NUMBER = /^[0-9]+$/;
const WHITESPACE = /\s+/;
const OPERATORS = ["+", "-", "*", "/", "%"];

const isLetter = (char) => LETTER.test(char);
const isNumber = (char) => NUMBER.test(char);
const isWhitespace = (char) => WHITESPACE.test(char);
const isOpeningParenthesis = (char) => char === "(";
const isClosingParenthesis = (char) => char === ")";
const isParenthesis = (char) =>
  isOpeningParenthesis(char) || isClosingParenthesis(char);
const isQuote = (char) => char === '"'; // || char === "'"
const isOperator = (char) => OPERATORS.includes(char);

export {
  isLetter,
  isNumber,
  isWhitespace,
  isOpeningParenthesis,
  isClosingParenthesis,
  isParenthesis,
  isQuote,
  isOperator,
};
