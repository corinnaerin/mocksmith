import { GeneratorFn } from "./types/GeneratorFn";
import { GeneratorOverrides } from "./types/GeneratorOverrides";
import { IterableGeneratorFn } from "./types/IterableGeneratorFn";

/**
 * Create a generator that generates a Set using the given generator
 *
 * Example 1: Generating a set of objects
 *
 * ```typescript
 * interface MyObject {
 *     key1: string;
 *     key2: number;
 * }
 *
 * const generateMyObject = createObjectGenerator({
 *    key1: () => chance.guid(),
 *    key2: () => chance.natural()
 * });
 *
 * const generateMyObjectSet = createSetGenerator(generateMyObject, 10);
 *
 * // A set of 10 objects
 * const myObjects: Set<MyObject> = generateMyObjectSet();
 * // A set of 5 objects
 * const myObjects2: Set<MyObject> = generateMyObjectSet(2);
 *
 * // Note that due to the nature of Sets, `undefined` values
 * // in the overrides will not be replaced with a generated value.
 * const overrides: GeneratorOverrides<Set<MyObject>>(new Set([
 *     { key1: "one" },
 *     {},
 *     {}
 * ]);
 * // A set of 3 objects. Missing properties in the set's values will be generated
 * const myObjectsWithOverrides = generateMyObjectSet(overrides);
 * ```
 *
 * Example 2: Generating a set of primitives
 *
 * ```typescript
 * const generateNumericSet = createSetGenerator(() => chance.natural(), 10);
 * // A set of 10 numbers
 * const numbers: Set<number> = generateNumericSet();
 * // A set of 5 numbers
 * const numbers2: Set<number> = generateNumericSet(5);
 * // This will return exactly the passed overrides, as there is nothing to be generated
 * // So it's not actually necessary to use the generator in this case
 * const numbers3: Set<number> = generateNumericSet(new Set([1,2,3]);
 * ```
 *
 * @param generator Generator function used to generate the set's values
 * @param defaultSize The default size of the set to be generated when no overrides are specified
 */
export function createSetGenerator<T>(generator: GeneratorFn<T>, defaultSize = 3): IterableGeneratorFn<Set<T>> {
  return (overridesOrSize) => {
    if (overridesOrSize instanceof Set) {
      const overrides = overridesOrSize as Set<GeneratorOverrides<T>>;
      const generated = new Set<T>();
      overrides.forEach((value: GeneratorOverrides<T>) => {
        if (generator.length > 0) {
          generated.add(generator(value));
        } else {
          generated.add(value as T);
        }
      });
      return generated;
    }
    const size = typeof overridesOrSize === "number" ? overridesOrSize : defaultSize;
    const generated = new Set<T>();
    for (let i = 0; i < size; i++) {
      generated.add(generator());
    }
    return generated;
  };
}
