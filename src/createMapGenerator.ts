import { GeneratorFn } from "./types/GeneratorFn";
import { GeneratorOverrides } from "./types/GeneratorOverrides";
import { IterableGeneratorFn } from "./types/IterableGeneratorFn";

/**
 * Create a generator that generates a map using the given key & value generators
 *
 * Example:
 *
 * ```
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
 * const generateMyObjectMap = createMapGenerator(
 *      // You must ensure that the generator for the key returns a unique result
 *      // or you will not be guaranteed a Map of the desired size
 *     () => chance.guid(),
 *     generateMyObject,
 *     10
 * );
 *
 * // A map with 10 key/value pairs
 * const myObjectMap: Map<string, MyObject> = generateMyObjectMap();
 * // A map with 5 key/value pairs
 * const myObjectMap2: Map<string, MyObject> = generateMyObjectMap(5);
 *
 * const overrides: GeneratorOverrides<Map<string, MyObject>> = new Map(
 *     ["one", { key1: "one" }],
 *     ["two", {}],
 *     ["three", undefined }
 * }
 *  * // The keys of this map will be "one", "two", and "three", and missing properties
 * // in the map's values will be generated
 * const myObjectMapWithOverrides: Map<string, MyObject> = generateMyObjectMap(overrides);
 * ```
 *
 * @param keyGenerator Generator function used to generate the map key
 * @param valueGenerator Generator function used to generate the map value
 * @param defaultSize The default size of the map to be generated when no overrides are specified
 */
export function createMapGenerator<KeyType, ValueType>(
  keyGenerator: GeneratorFn<KeyType>,
  valueGenerator: GeneratorFn<ValueType>,
  defaultSize = 3
): IterableGeneratorFn<Map<KeyType, ValueType>> {
  return (overridesOrSize): Map<KeyType, ValueType> => {
    if (overridesOrSize instanceof Map) {
      const overrides = overridesOrSize as Map<KeyType, GeneratorOverrides<ValueType>>;
      const generated = new Map<KeyType, ValueType>();
      overrides.forEach((value: GeneratorOverrides<ValueType>, key: KeyType) => {
        if (valueGenerator.length > 0) {
          generated.set(key, valueGenerator(value));
        } else if (value === undefined) {
          generated.set(key, valueGenerator());
        } else {
          generated.set(key, value as ValueType);
        }
      });
      return generated;
    }
    const size = typeof overridesOrSize === "number" ? overridesOrSize : defaultSize;
    const generated = new Map<KeyType, ValueType>();
    for (let i = 0; i < size; i++) {
      generated.set(keyGenerator(), valueGenerator());
    }
    return generated;
  };
}
