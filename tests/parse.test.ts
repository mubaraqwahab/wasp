import { lex } from "../src/index.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

Deno.test("Lex", () => {
  assertEquals([], lex("(+ 1 2)"));
});
