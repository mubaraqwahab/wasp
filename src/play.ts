import { lex } from "./lex.ts";
import { parse } from "./parse.ts";
import { generate } from "./generate.ts";

const src = `
(* (+ 2 4) 3)
(if (> 5 8)
    "5 is greater than 8"
  (if (< 5 8)
      "5 is less than 8"
    "5 is equal to 8"))
`;

console.log(eval(generate(parse(lex(src)))));
