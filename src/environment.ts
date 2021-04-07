import { Environment, SExpression } from "./types.ts";

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

    "<": (...numbers: number[]) => {
      if (!numbers.length) throw new Error(); // expected at least one arg
      assertElementsType(numbers, "number");
      return applyPredicate<number>((a, b) => a < b)(...numbers);
    },

    "<=": (...numbers: number[]) => {
      if (!numbers.length) throw new Error(); // expected at least one arg
      assertElementsType(numbers, "number");
      return applyPredicate<number>((a, b) => a <= b)(...numbers);
    },

    ">": (...numbers: number[]) => {
      if (!numbers.length) throw new Error(); // expected at least one arg
      assertElementsType(numbers, "number");
      return applyPredicate<number>((a, b) => a > b)(...numbers);
    },

    ">=": (...numbers: number[]) => {
      if (!numbers.length) throw new Error(); // expected at least one arg
      assertElementsType(numbers, "number");
      return applyPredicate<number>((a, b) => a >= b)(...numbers);
    },

    "=": applyPredicate((a, b) => a === b),
    "!=": applyPredicate((a, b) => a !== b),

    not: (x: SExpression) => !x, // is this good enough?
    or: (...list: SExpression[]) => list.reduce((res, e) => res || e),
    and: (...list: SExpression[]) => list.reduce((res, e) => res && e),

    max: (...numbers: number[]) => {
      assertElementsType(numbers, "number");
      return Math.max(...numbers);
    },

    min: (...numbers: number[]) => {
      assertElementsType(numbers, "number");
      return Math.min(...numbers);
    },

    print: (...values: SExpression[]) => {
      console.log(...values);
    },

    type: (val: SExpression) => {
      if (typeof val === "undefined") throw new Error(); // Expected one arg
      return Array.isArray(val) ? "list" : typeof val;
    },

    first: (...list: SExpression[]) => list[0],
    last: (...list: SExpression[]) => list[list.length - 1],
    nth: (n: number, ...list: SExpression[]) => list[n],
    // review what follows
    rest: (_: SExpression, ...others: SExpression[]) => others,
    cons: (first: SExpression, ...rest: SExpression[]) => [first, ...rest],
    list: (...elements: SExpression[]) => elements,
  },

  variables: {
    inf: Infinity,
    "-inf": -Infinity,
    pi: Math.PI,
  },
};

const symbols = ["true", "false", "nil"];

export { defaultEnv };
