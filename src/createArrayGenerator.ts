import { GeneratorFn } from "./types/GeneratorFn";
import { ArrayGeneratorFn } from "./types/IterableGeneratorFn";

/**
 * Create a generator that generates an array from the specified generator
 *
 * Example 1: Generating an array of objects
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
 * const generateMyObjectsArray = createArrayGenerator(generateMyObject, 10);
 *
 * // This will be an array of 10 generated MyObject objects
 * const myObjects: MyObject[] = generateMyObjectsArray();
 * // This will be an array of 5 generated MyObject objects
 * const myObjects2: MyObject[] = generateMyObjectsArray(5);
 *
 * // If overrides are specified, the resulting array will be the same size
 * // Missing properties of the overrides will be generated
 * const overrides: GeneratorOverrides<MyObject[]> = [
 *   {},
 *   undefined,
 *   { key1: "value1" }
 * ]
 * const myObjectsWithOverrides: MyObject[] = generatedMyObjectsArray(overrides);
 * ```
 *
 * Example 2: Generating an array of primitives
 *
 * ```typescript
 * const generateNumberArray = createArrayGenerator(() => chance.natural());
 * // An array of 10 random numbers
 * const numbers = generateNumberArray();
 * // An array of 5 random numbers
 * const numbers2 = generateNumberArray(5);
 * // An array of of [<random_number>, 2, <random_number>]
 * const numbers3 = generateNumberArray([undefined, 2, undefined]);
 * ```
 *
 * @param generator Any generator function used to generate the array
 * @param defaultSize The default size of the array to be generated when no overrides are specified
 */
export function createArrayGenerator<T>(generator: GeneratorFn<T>, defaultSize = 3): ArrayGeneratorFn<T> {
  return (overridesOrSize) => {
    if (Array.isArray(overridesOrSize)) {
      return overridesOrSize.map((override) => {
        if (generator.length > 0) {
          return generator(override);
        }
        if (override === undefined) {
          return generator();
        }
        return override as T;
      });
    }

    if (typeof overridesOrSize === "object") {
      const { size, sharedOverrides } = overridesOrSize;
      const generated: T[] = [];
      for (let i = 0; i < size; i++) {
        generated.push(generator(sharedOverrides));
      }
      return generated;
    }

    const size = typeof overridesOrSize === "number" ? overridesOrSize : defaultSize;
    const generated: T[] = [];
    for (let i = 0; i < size; i++) {
      generated.push(generator());
    }
    return generated;
  };
}
