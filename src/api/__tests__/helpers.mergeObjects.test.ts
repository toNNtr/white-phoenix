import { mergeObjects } from "../helpers";
import { expect, test } from "vitest";

test("merges objects without nested objects", () => {
    const first = {
        a: "aaa",
        b: 123,
        c: false,
    };

    const second = {
        b: 321,
    };

    expect(mergeObjects(first, second)).toMatchInlineSnapshot(`
      {
        "a": "aaa",
        "b": 321,
        "c": false,
      }
    `);
});

test("merges objects with nested objects", () => {
    const first = {
        a: {
            aa: "aaa",
            ab: 456,
            bc: true,
        },
        b: {
            ba: {
                baa: "baa",
                bab: 789,
                bac: true,
            },
        },
        c: false,
    };

    const second = {
        a: {
            ab: 654,
        },
        b: {
            ba: {
                bac: false,
            },
        },
    };

    expect(mergeObjects(first, second)).toMatchInlineSnapshot(`
      {
        "a": {
          "aa": "aaa",
          "ab": 654,
          "bc": true,
        },
        "b": {
          "ba": {
            "baa": "baa",
            "bab": 789,
            "bac": false,
          },
        },
        "c": false,
      }
    `);
});

test("merges objects with functions", () => {
    const fn1 = () => {};
    const fn2 = () => {};

    const first = {
        a: "aaa",
        b: fn1,
        c: false,
    };

    const second = {
        b: fn2,
    };

    expect(mergeObjects(first, second).b).toBe(fn2);
});

test("merges arrays in merged objects", () => {
    const fn1 = () => {};
    const fn2 = () => {};

    const first = {
        a: "aaa",
        b: ["ba", "bb", fn1],
        c: false,
    };

    const second = {
        b: ["bb", fn1, fn2],
    };

    const merge = mergeObjects(first, second);
    expect(merge).toMatchInlineSnapshot(`
      {
        "a": "aaa",
        "b": [
          "ba",
          "bb",
          [Function],
          [Function],
        ],
        "c": false,
      }
    `);
    expect(merge.b[2]).toBe(fn1);
    expect(merge.b[3]).toBe(fn2);
});

test("throws error when object type mismatch", () => {
    const first = {
        a: "aaa",
        b: {},
        c: false,
    };

    const second = {
        b: "bbb",
    };

    expect(() => mergeObjects(first, second)).toThrowErrorMatchingInlineSnapshot(
        `[Error: Objects interface doesn't match.]`,
    );
});

test("throws error when array type mismatch", () => {
    const first = {
        a: "aaa",
        b: [],
        c: false,
    };

    const second = {
        b: "bbb",
    };

    // @ts-expect-error
    expect(() => mergeObjects(first, second)).toThrowErrorMatchingInlineSnapshot(
        `[Error: Objects interface doesn't match.]`,
    );
});

test("doesn't copy extra properties", () => {
    const first = {
        a: "aaa",
        b: [],
        c: false,
    };

    const second = {
        b: [],
        c: true,
        d: "not exist",
    };

    expect(mergeObjects(first, second)).toMatchInlineSnapshot(`
      {
        "a": "aaa",
        "b": [],
        "c": true,
      }
    `);
});

test("doesn't copy circular references", () => {
    const circularOne = { two: {} };
    const circularTwo = { one: circularOne };
    circularOne.two = circularTwo;

    const first = {
        a: "aaa",
        b: { two: { one: { two: {} } } },
        c: false,
    };

    const second = {
        b: circularOne,
    };

    expect(mergeObjects(first, second)).toMatchInlineSnapshot(`
      {
        "a": "aaa",
        "b": {
          "two": {
            "one": null,
          },
        },
        "c": false,
      }
    `);
});

test("doesn't copy falsy values exept [false]", () => {
    const first = {
        a: "aaa",
        b: [],
        c: true,
    };

    const second = {
        a: "",
        b: null,
        c: false,
    };

    // @ts-expect-error
    expect(mergeObjects(first, second)).toMatchInlineSnapshot(`
      {
        "a": "aaa",
        "b": [],
        "c": false,
      }
    `);
});
