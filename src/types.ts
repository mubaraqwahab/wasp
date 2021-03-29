export type { Node, Token };
export { TokenType };

enum TokenType {
  NUMBER = "number",
  SYMBOL = "symbol",
  STRING = "string",
  OPENING_PARENTHESIS = "openparenthesis",
  CLOSING_PARENTHESIS = "closeparenthesis",
  COMMENT = "comment",
}

interface Token {
  type: TokenType;
  value?: number | string;
  quoted?: boolean;
  position?: Position;
}

interface Position {
  start: Point;
  end: Point;
  indent?: number[];
}

interface Point {
  line: number;
  column: number;
  offset?: number;
}

interface Node {
  type: string;
  position: Position;
}
