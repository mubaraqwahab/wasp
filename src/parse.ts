import { Node, NodeType, Token, TokenType } from "./types.ts";

function parse(tokens: Token[]): Node {
  return { type: NodeType.PROGRAM, children: parseAux(tokens) };
}

function parseAux(tokens: Token[], list = false): Node[] {
  if (!tokens.length) {
    // End of file while in list
    if (list) throw new SyntaxError();
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
      if (!list) {
        throw new SyntaxError();
      }
      return result;
    default:
      // TODO: what should happen? error?
      break;
  }

  result.push(...parseAux(tokens, list));
  return result;
}

export { parse };
