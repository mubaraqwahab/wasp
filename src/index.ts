import { lex } from "./lex.ts";
import { parse } from "./parse.ts";
import { generate } from "./generate.ts";
import { evaluate } from "./evaluate.ts";
import { Node } from "./types.ts";

function _generate(src: string): string;
function _generate(ast: Node): string;

function _generate(src: string | Node): string {
  if (typeof src === "string") {
    src = parse(lex(src));
  }
  return generate(src as Node);
}

const wasp = {
  lex,
  parse(src: string) {
    return parse(lex(src));
  },
  generate: _generate,
  evaluate(src: string) {
    return evaluate(parse(lex(src)));
  },
};

export default wasp;
