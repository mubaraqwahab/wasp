interface Node {}

interface Token {
  type: string;
  value: any;
}

function lex(code: string): Token[] {
  const tokens: Token[] = [];
  return tokens;
}

function parse(tokens: Token[]): Node {
  const ast: Node = {};
  return ast;
}

export { lex, parse };
