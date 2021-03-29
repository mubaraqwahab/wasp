import { Token, TokenType } from "./types.ts";

const isSign = (c: string) => c === "+" || c === "-";
const isDigit = (c: string) => /^[0-9]$/.test(c);
const isLetter = (c: string) => /^[a-z]$/.test(c);
const isEscape = (c: string) => c === "\\";
const isSymbolChar = (c: string) => {
  return isLetter(c) || /^[`~!@#$%^&*\-_=+[{\]}\\\|;:,<>\/\?]$/.test(c);
};
const isEOL = (c: string) => /^[\r\n]$/.test(c);
const isWhitespace = (c: string) => /^\s$/.test(c);

const s = JSON.stringify;
const quoteError = (c: string) => {
  return new SyntaxError(
    `found ${s(c)} after quote "'". ` +
      `A quote may only precede an atom or a list.`,
  );
};

function lex(src: string): Token[] {
  const tokens: Token[] = [];

  for (let cursor = 0; cursor < src.length;) {
    // Quote
    let quoted = false;
    if (src[cursor] === "'") {
      quoted = true;
      cursor++;
    }
    // Subtle note on the above:
    // A quote is "meaningful" only when it precedes a symbol or an open paren
    // A quoted string or number is equivalent to the corresponding unquoted string or number.
    // A quote may not precede any other token besides the above (that is, including whitespace).

    // Number
    let sign = "";
    if (isSign(src[cursor])) {
      sign = src[cursor];
      cursor++;
    }

    if (isDigit(src[cursor])) {
      let value = sign + src[cursor];
      while (isDigit(src[++cursor])) {
        value += src[cursor];
      }
      tokens.push({ type: TokenType.NUMBER, value: +value });
      continue;
    } // A sign not succeeded by a digit is not a number.
    else if (sign) {
      cursor--;
    }

    // Symbol
    if (isSymbolChar(src[cursor])) {
      let value = src[cursor];
      while (isSymbolChar(src[++cursor]) || isDigit(src[cursor])) {
        value += src[cursor];
      }
      tokens.push({ type: TokenType.SYMBOL, value, quoted });
      continue;
    }

    // String
    if (src[cursor] === '"') {
      let value = "";
      // Consume all chars until the next (unescaped) quote.
      while (src[++cursor] !== '"' || isEscape(src[cursor - 1])) {
        value += src[cursor];
      }
      tokens.push({ type: TokenType.STRING, value });
      cursor++;
      continue;
    }

    // Open Paren
    if (src[cursor] === "(") {
      tokens.push({ type: TokenType.OPENING_PARENTHESIS, quoted });
      cursor++;
      continue;
    }

    // Close Paren
    if (src[cursor] === ")") {
      if (quoted) throw quoteError(src[cursor]);

      tokens.push({ type: TokenType.CLOSING_PARENTHESIS });
      cursor++;
      continue;
    }

    // Comment
    if (src[cursor] === ";") {
      if (quoted) throw quoteError(src[cursor]);

      let value = "";
      while (!isEOL(src[++cursor])) {
        value += src[cursor];
      }
      tokens.push({ type: TokenType.COMMENT, value });
      cursor++; // not necessary tho
      continue;
    }

    // Whitespace
    if (isWhitespace(src[cursor])) {
      if (quoted) throw quoteError(src[cursor]);

      while (isWhitespace(src[++cursor]));
      continue;
    }

    // Unrecognized chars
    throw new SyntaxError(`unrecognized character ${s(src[cursor])}`);
  }

  return tokens;
}

export { lex };
