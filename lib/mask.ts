import { micromatch } from "../deps.ts";

export default function mask(anyType: unknown, masks: string[]): unknown {
  validateMasks(masks);
  let matches = 0;
  const _mask = (
    currType: unknown,
    _masks: string[],
    dotPath = ``,
  ): unknown => {
    const shouldMask = micromatch.isMatch(dotPath, _masks);
    matches += shouldMask ? 1 : 0;
    // _masks.filter((m) => m === dotPath).length;
    if (currType instanceof Array) {
      return shouldMask
        ? `[MASKED array]`
        : currType.map((el, idx) => _mask(el, _masks, `${dotPath}/${idx}`));
    } else if (currType instanceof Object) {
      return shouldMask ? `[MASKED object]` : Object.entries(currType).reduce(
        (acc: Record<string, unknown>, entry) => {
          const [key, val] = entry;
          acc[key] = _mask(val, _masks, `${dotPath}/${key}`);
          return acc;
        },
        {},
      );
    } else {
      return shouldMask ? `[MASKED ${typeof currType}]` : currType;
    }
  };
  const result = _mask(anyType, masks);

  // if no matches are found, likely the masks are an error
  if (matches === 0 && 0 < masks.length) {
    throw new Error(`None of the masks matched. This is likely an error`);
  }

  return result;
}

/** ensure that each mask starts with '/' */
function validateMasks(masks: string[]) {
  const violations: string[] = masks.filter((m: string) => m[0] !== "/");
  if (violations.length) {
    throw new Error(
      `Masks should begin from root '/'. Violations:\n  ${
        violations.join(
          "\n  ",
        )
      }`,
    );
  }
}
