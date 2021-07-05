import test from "../mod.ts";
import mask from "./mask.ts";

const o = {
  blah: [
    { blue: 1, a: 1 },
    { blue: 2, a: 2 },
  ],
  a: {
    s: {
      d: {
        f: true,
        g: true,
      },
      d1: "d1",
    },
    s1: "s1",
  },
  a1: "a1",
  b: [
    { c: 1, d: 1 },
    { c: 2, d: 2 },
  ],
};

test(`mask with matches`, ({ assertSnapshot }) => {
  const matchers = ["/blah/*/blue", "/a/s/d/f", "/b/0/c"];
  const d = mask(o, matchers);
  assertSnapshot(d);
});

test(`mask validation error`, ({ assertSnapshot }) => {
  const matchers = ["blah/*/blue", "a/s/d/f", "b/0/c"];
  try {
    mask(o, matchers);
  } catch (err) {
    assertSnapshot(err.message);
  }
});

test(`mask no match error`, ({ assertSnapshot }) => {
  const matchers = ["/red", "/blue"];
  try {
    mask(o, matchers);
  } catch (err) {
    assertSnapshot(err.message);
  }
});
