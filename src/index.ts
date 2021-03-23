import { lex } from "./lex.ts";
import { parse } from "./parse.ts";

export const wasp = {
  lex,
  parse,
  parseString(src: string) {
    return parse(lex(src));
  },
};
