export type { Node, Token };
export { NodeType, TokenType };

enum TokenType {
  NUMBER = "number",
  SYMBOL = "symbol",
  STRING = "string",
  OPENING_PARENTHESIS = "openingparen",
  CLOSING_PARENTHESIS = "closingparen",
  COMMENT = "comment",
}

interface Token {
  type: TokenType;
  value?: number | string;
  quoted?: boolean;
}

enum NodeType {
  NUMBER = "number",
  SYMBOL = "symbol",
  STRING = "string",
  LIST = "list",
  COMMENT = "comment",
  PROGRAM = "program",
}

interface Node {
  type: NodeType;
  value?: number | string;
  quoted?: boolean;
  children?: Node[];
}
