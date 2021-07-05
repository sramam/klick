import test from "./mod.ts";

test(`assertSnapshot Test`, ({ assertSnapshot }) => {
  assertSnapshot({ a: 1, b: "b" });
  assertSnapshot({ c: 2, d: "d" });
});

test(`a second test`, ({ assertSnapshot }) => {
  assertSnapshot([1, 2, 3]);
  assertSnapshot("some string");
  assertSnapshot(2);
  assertSnapshot(true);
});

test({
  name: `skip test on update`,
  fn: ({ assertSnapshot }) => {
    // this test case is skipped with a --update flag.
    assertSnapshot({
      a: 1,
      u: Deno.args.includes("--update"),
    });
  },
  ignore: Deno.args.includes("--update"),
});

test(`test with masks`, ({ assertSnapshot }) => {
  const ot = {
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

  const masks = ["/blah/*/blue", "/a/s/d/f", "/b/0/c"];
  assertSnapshot(ot, masks);
});

test(`Test with masks - example`, ({ assertSnapshot }) => {
  const actual = {
    a: "a",
    b: 1,
    c: {
      start: Date.now(),
      randomArray: [
        Math.random(),
        Math.random(),
      ],
    },
  };
  const masks = ["/c/start", "/c/randomArray/*"];
  assertSnapshot(actual, masks);
});
