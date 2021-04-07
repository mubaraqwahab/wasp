import { Environment, SExpression } from "./types.ts";

function apply<T>(
  fn: (a: T, b: T) => T,
  type?: "number" | "string" | "symbol",
) {
  return function (...list: T[]) {
    if (list.length < 2) throw new Error(); // expected at least one arg
    if (type) {
      let index;
      const hasTypeError = list.some((e, i) => {
        index = i;
        return typeof e !== type;
      });
      if (hasTypeError) {
        // you can do better with the error msg
        throw new TypeError(`${index}th arg is not a ${type}`);
      }
    }
    return list.reduce(fn);
  };
}

function applyPredicate<T>(pred: (a: T, b: T) => boolean) {
  return (...list: T[]) => {
    for (let i = 0; i < list.length - 1; i++) {
      if (!pred(list[i], list[i + 1])) return false;
    }
    return true;
  };
}

function assertElementsType(array: unknown[], type: "number" | "string") {
  array.forEach((e, i) => {
    // deno-lint-ignore valid-typeof
    if (typeof e !== type) {
      throw new TypeError(
        `${ordinalize(i + 1)} argument, ${array[i]}, is not a ${type}`,
      );
    }
  });

  function ordinalize(i: number): string {
    if (i === 1) return "1st";
    else if (i === 2) return "2nd";
    else return `${i}th`;
  }
}

const defaultEnv: Environment = {
  functions: {
    "+": (...numbers: number[]): number => {
      assertElementsType(numbers, "number");
      return numbers.reduce((res, n) => res + n, 0);
    },

    "-": (...numbers: number[]): number => {
      if (!numbers.length) throw new Error(); // expected at least one arg

      assertElementsType(numbers, "number");

      if (numbers.length === 1) return -numbers[0];
      return numbers.reduce((res, n) => res - n);
    },

    "*": (...numbers: number[]): number => {
      assertElementsType(numbers, "number");
      return numbers.reduce((res, n) => res * n, 1);
    },

    "/": (...numbers: number[]): number => {
      if (numbers.length < 2) throw new Error(); // expected at least two args

      assertElementsType(numbers, "number");
      return numbers.reduce((res, n) => {
        if (n === 0) throw new Error(); // zero division error
        return res / n;
      });
    },

    "**": (...numbers: number[]): number => {
      if (numbers.length < 2) throw new Error(); // expected at least two args

      assertElementsType(numbers, "number");
      return numbers.reduce((res, n) => res ** n);
    },

    "%": (...numbers: number[]): number => {
      if (numbers.length < 2) throw new Error(); // expected at least two args

      assertElementsType(numbers, "number");
      return numbers.reduce((res, n) => res % n);
    },

    "//": (...numbers: number[]): number => {
      if (numbers.length < 2) throw new Error(); // expected at least two args

      assertElementsType(numbers, "number");
      return numbers.reduce(Math.floor);
    },

    "<": applyPredicate<number>((a, b) => a < b),
    "<=": applyPredicate<number>((a, b) => a <= b),
    ">": applyPredicate<number>((a, b) => a > b),
    ">=": applyPredicate<number>((a, b) => a >= b),
    "=": applyPredicate((a, b) => a === b),
    "!=": applyPredicate((a, b) => a !== b),

    not: (x: SExpression) => !x, // is this good enough?
    or: apply((a: SExpression, b: SExpression) => a || b),
    and: apply((a: SExpression, b: SExpression) => a && b),

    max: apply(Math.max, "number"),
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

export { defaultEnv };
