export type { Node, Token };
export { TokenType };

enum TokenType {
  NUMBER,
  SYMBOL,
  STRING,
  OPENING_PARENTHESIS,
  CLOSING_PARENTHESIS,
  COMMENT,
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
