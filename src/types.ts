export type { Node, Token };
export { TokenType };

enum TokenType {
  NUMBER,
  SYMBOL,
  STRING,
  PARENTHESIS,
  COMMENT,
}

interface Token {
  type: TokenType;
  value: number | symbol | string;
  literal: boolean;
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
  // type: string;
  // position: Position;
}
