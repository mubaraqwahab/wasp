import { Environment } from "./types.ts";

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

    not: (x: unknown) => !x,
    or: all((a: unknown, b: unknown) => a || b),
    and: all((a: unknown, b: unknown) => a && b),

    max: Math.max,
    min: Math.min,
    print: console.log,

    first: (a: unknown, ..._: unknown[]) => a,
    last: (...list: unknown[]) => list[list.length - 1],
    nth: (n: number, ...list: unknown[]) => list[n],
    rest: (_: unknown, ...others: unknown[]) => others,
    cons: (first: unknown, ...rest: unknown[]) => [first, ...rest],
    list: (...elements: unknown[]) => elements,
  },
  symbols: {
    pi: Math.PI,
  },
};

export { defaultEnv };
