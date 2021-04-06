export type {
  Atom,
  Environment,
  Node,
  SExpression,
  Token,
  UAtom,
  USExpression,
};
export { NodeType, TokenType };

enum TokenType {
  NUMBER = "number",
  SYMBOL = "symbol",
  STRING = "string",
  OPENING_PARENTHESIS = "openingparen",
  CLOSING_PARENTHESIS = "closingparen",
  COMMENT = "comment",
}

interface NumberToken {
  type: TokenType.NUMBER;
  value: number;
}

interface SymbolToken {
  type: TokenType.SYMBOL;
  value: string;
  quoted: boolean;
}

interface StringToken {
  type: TokenType.STRING;
  value: string;
}

interface OpeningParenthesisToken {
  type: TokenType.OPENING_PARENTHESIS;
  quoted: boolean;
}

interface ClosingParenthesisToken {
  type: TokenType.CLOSING_PARENTHESIS;
}

interface CommentToken {
  type: TokenType.COMMENT;
  value: string;
}

type Token =
  | NumberToken
  | SymbolToken
  | StringToken
  | OpeningParenthesisToken
  | ClosingParenthesisToken
  | CommentToken;

enum NodeType {
  NUMBER = "number",
  SYMBOL = "symbol",
  STRING = "string",
  LIST = "list",
  COMMENT = "comment",
  PROGRAM = "program",
}

interface NumberNode {
  type: NodeType.NUMBER;
  value: number;
}

interface SymbolNode {
  type: NodeType.SYMBOL;
  value: string;
  quoted: boolean;
}

interface StringNode {
  type: NodeType.STRING;
  value: string;
}

interface ListNode {
  type: NodeType.LIST;
  children: Node[];
  quoted: boolean;
}

interface CommentNode {
  type: NodeType.COMMENT;
  value: string;
}

interface ProgramNode {
  type: NodeType.PROGRAM;
  children: Node[];
}

type Node =
  | NumberNode
  | SymbolNode
  | StringNode
  | ListNode
  | CommentNode
  | ProgramNode;

type Atom = number | string | symbol;
type UAtom = Atom | undefined;
type SExpression = Atom | SExpression[];
type USExpression = UAtom | USExpression[];

interface Environment {
  functions: {
    // deno-lint-ignore ban-types
    [key: string]: Function;
  };
  variables: {
    [key: string]: SExpression;
  };
}
