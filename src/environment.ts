import { Atom, Environment, SExpression } from "./types.ts";

function isSpecialForm(name: string) {
  return name in new Set<string>(["let", "if", "defun"]);
}

function all<T>(fn: (a: T, b: T) => T) {
  return (first: T, ...rest: T[]) => rest.reduce(fn, first);
}

function allWithPredicate<T>(pred: (a: T, b: T) => boolean) {
  return (list: T[]) => {
    for (let i = 0; i < list.length - 1; i++) {
      if (!pred(list[i], list[i + 1])) return false;
    }
    return true;
  };
}

const defaultEnv: Environment = {
  functions: {
    "+": all((a: number, b: number) => a + b),
    "-": all((a: number, b: number) => a - b),
    "*": all((a: number, b: number) => a * b),
    "/": all((a: number, b: number) => a / b),
    "**": all((a: number, b: number) => a ** b),
    "%": all((a: number, b: number) => a % b),
    "//": all((a: number, b: number) => Math.floor(a / b)),

    "<": allWithPredicate((a: number, b: number) => a < b),
    "<=": allWithPredicate((a: number, b: number) => a <= b),
    ">": allWithPredicate((a: number, b: number) => a > b),
    ">=": allWithPredicate((a: number, b: number) => a >= b),
    "=": allWithPredicate((a: unknown, b: unknown) => a === b),
    "!=": allWithPredicate((a: number, b: number) => a !== b),

    not: (x: SExpression) => !x,
    or: all((a: SExpression, b: SExpression) => a || b),
    and: all((a: SExpression, b: SExpression) => a && b),

    max: Math.max,
    min: Math.min,
    print: console.log,
    type: (val: SExpression) => Array.isArray(val) ? "list" : typeof val,

    first: (a: SExpression, ..._: SExpression[]) => a,
    last: (...list: SExpression[]) => list[list.length - 1],
    nth: (n: number, ...list: SExpression[]) => list[n],
    rest: (_: SExpression, ...others: SExpression[]) => others,
    cons: (first: SExpression, ...rest: SExpression[]) => [first, ...rest],
    list: (...elements: SExpression[]) => elements,
  },
  variables: {
    pi: Math.PI,
  },
};

export { defaultEnv, isSpecialForm };
