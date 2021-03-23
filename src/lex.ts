import { Token, TokenType } from "./types.ts";

const isDigit = (c: string) => /^[0-9]$/.test(c);
const isLetter = (c: string) => /^[a-z]$/.test(c);
const isEscape = (c: string) => c === "\\";
const isSymbolChar = (c: string) => {
  return isLetter(c) || /^[`~!@#$%^&*\-_=+[{\]}\\\|;:,<.>\/\?]$/.test(c);
};
const isEOL = (c: string) => /^[\r\n]$/.test(c);
const isWhitespace = (c: string) => /^\s$/.test(c);

function lex(src: string): Token[] {
  const tokens: Token[] = [];

  for (let cursor = 0; cursor < src.length;) {
    // Literal
    let literal = false;
    if (src[cursor] === "'") {
      literal = true;
      cursor++;
    }

    // Number

    // Symbol
    if (isSymbolChar(src[cursor])) {
      let value = src[cursor];
      while (isSymbolChar(src[++cursor]) || isDigit(src[cursor])) {
        value += src[cursor];
      }
      tokens.push({ type: TokenType.SYMBOL, value, literal });
    } // String
    else if (src[cursor] === '"') {
      let value = "";
      // Consume all chars until the next (unescaped) quote.
      while (src[++cursor] !== '"' || isEscape(src[cursor - 1])) {
        value += src[cursor];
      }
      tokens.push({ type: TokenType.STRING, value, literal });
      cursor++;
    } // Paren
    else if (src[cursor] === "(" || src[cursor] === ")") {
      tokens.push({ type: TokenType.PARENTHESIS, value: src[cursor], literal });
      cursor++;
    } // Comment
    else if (src[cursor] === ";") {
      while (isEOL(src[++cursor]));
    } // Whitespace
    else {
      while (isWhitespace(src[++cursor]));
    }
  }

  return tokens;
}

export { lex };
