import { Atom, AtomOrList, Environment, List } from "./types.ts";

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

    not: (x: AtomOrList) => !x,
    or: all((a: AtomOrList, b: AtomOrList) => a || b),
    and: all((a: AtomOrList, b: AtomOrList) => a && b),

    max: Math.max,
    min: Math.min,
    print: console.log,
    type: (val: AtomOrList) => Array.isArray(val) ? "list" : typeof val,

    first: (a: AtomOrList, ..._: List<Atom>) => a,
    last: (...list: List<Atom>) => list[list.length - 1],
    nth: (n: number, ...list: List<Atom>) => list[n],
    rest: (_: AtomOrList, ...others: List<Atom>) => others,
    cons: (first: AtomOrList, ...rest: List<Atom>) => [first, ...rest],
    list: (...elements: List<Atom>) => elements,
  },
  symbols: {
    pi: Math.PI,
  },
};

export { defaultEnv, isSpecialForm };
