# klick

`klick` is a test snapshot library for Deno.

Features:

- Two update modes:
  1. `update` fine grained update (only filtered tests, even within a single
     suite)
  2. `refresh` coarse grained update (removes un-exercised snapshots within
     suites)
- Simple ability to `mask` variant fields, accessed via json-ptr
- CI aware - does not update snapshots on CI server
- Snapshot files are valid JSON5

## Required Permissions

In practice, we'll need to use this:

- `--allow-read`: to read snapshots
- `--allow-write`: to create/update snapshots
- `--unstable`: for `fs` capability from deno std-lib

Current deno implementation does not allow for wild-cards and globs in the
permissions `allow-list`. Ideally, this is the set of permissions `klick` needs:

- `--allow-read="./**/*.assertSnapshot"`: to read snapshots
- `--allow-write="./**/*.assertSnapshot"`: to create/update snapshots
- `--unstable`: for `fs` capability from deno std-lib

## Usage

### Writing tests

```
import test from "https://deno.land/x/klick@0.1.2/mod.ts

test(`Simple test`, ({ assertSnapshot}) => {
  const actual = {
    a: 'a',
    b: 1
  }
  assertSnapshot(actual);
  actual.c = 'c'
  assertSnapshot(actual);
})

test(`Test with masks`, ({ assertSnapshot}) => {
  const actual = {
    a: 'a',
    b: 1,
    c: {
      start: Date.now()
      randomArray:  [
        Math.random(),
        Math.random(),
      ]
    }
  }
  const masks = ['/c/start', '/c/randomArray/*']
  assertSnapshot(actual, masks);
})
```

Masked snapshot:

```
'Test with masks': {
    a: 'a',
    b: 1,
    c: {
      start: '[MASKED number]',
      randomArray: [
        '[MASKED number]',
        '[MASKED number]',
      ],
    },
  },
```

### Snapshot Management (Exercise from CLI)

#### New snapshots / Validate

Validate existing snapshots or create new snapshots

```
deno test --allow-write --allow-read --unstable
```

#### Filtered snapshot update

Only updates snapshots for tests being executed. Honors `ignore` and `only`
attributes from `Deno.TestDefinition`

```
deno test --allow-write --allow-read --unstable --filter "/.*another.*/" -- --update
```

or

```
deno test --allow-write --allow-read --unstable --filter "/.*another.*/" -- --u
```

#### Refresh snapshots

Update all snapshots, deleting any un-executed snapshots. Only does so if a
test-suite is executed

```
deno test --allow-write --allow-read --unstable -- --refresh
```

or

```
deno test --allow-write --allow-read --unstable -- --r
```
