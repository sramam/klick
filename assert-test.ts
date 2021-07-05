import {
  assertEquals,
  assertStrictEquals,
} from "https://deno.land/std@0.100.0/testing/asserts.ts";

const x = {
  a: "1",
  b: {
    c: 2,
  },
};

const y = {
  a: "1",
  b: {
    c: 4,
  },
};

const z = x;

assertEquals(x, y);
assertStrictEquals(x, z);
// assertStrictEquals(x, y, 'diff objects');
