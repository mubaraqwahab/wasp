import { lex } from "./lex.ts";
import { parse } from "./parse.ts";
import { evaluate } from "./evaluate.ts";

const wasp = {
  lex,
  parse(src: string) {
    return parse(lex(src));
  },
  evaluate(src: string) {
    return evaluate(parse(lex(src)));
  },
};

export default wasp;
