import { Node, NodeType, Token, TokenType } from "./types.ts";

const s = JSON.stringify;

function parse(tokens: Token[]): Node {
  return { type: NodeType.PROGRAM, children: parseAux(tokens) };
}

function parseAux(tokens: Token[], inList = false): Node[] {
  if (!tokens.length) {
    // End of file while in list
    if (inList) {
      throw new SyntaxError(`expected a closing parenthesis but found eof`);
    }
    return [];
  }

  const token = tokens.shift() as Token;
  const result: Node[] = [];

  switch (token.type) {
    case TokenType.NUMBER:
      result.push({ type: NodeType.NUMBER, value: token.value });
      break;
    case TokenType.SYMBOL:
      result.push({
        type: NodeType.SYMBOL,
        value: token.value,
        quoted: token.quoted,
      });
      break;
    case TokenType.STRING:
      result.push({ type: NodeType.STRING, value: token.value });
      break;
    case TokenType.OPENING_PARENTHESIS:
      result.push({
        type: NodeType.LIST,
        quoted: token.quoted,
        children: [...parseAux(tokens, true)],
      });
      break;
    case TokenType.CLOSING_PARENTHESIS:
      // error if no opening paren
      if (!inList) {
        throw new SyntaxError(`unexpected closing parenthesis found.`);
      }
      return result;
    case TokenType.COMMENT:
      break;
    default:
      throw new SyntaxError(`unrecognized token of type ${s(token.type)}`);
  }

  result.push(...parseAux(tokens, inList));
  return result;
}

export { parse };
