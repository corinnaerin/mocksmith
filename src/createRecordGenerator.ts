import { BasicGeneratorFn } from "./types/BasicGeneratorFn";
import { GeneratorFn } from "./types/GeneratorFn";
import { GeneratorOverrides } from "./types/GeneratorOverrides";
import { IterableGeneratorFn } from "./types/IterableGeneratorFn";

/**
 * Create a generator that generates a plain object (Record) using the given key & value generators
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
 * const generateMyObjectRecord = createRecordGenerator(
 *      // You must ensure that the generator for the key returns a unique result
 *      // or you will not be guaranteed an object of the desired size
 *     () => chance.guid()
 *     generateMyObject,
 *     10
 * );
 *
 * // An object with 10 key/value pairs
 * const myObjectRecord: Record<string, MyObject> = generateMyObjectRecord();
 * // An object with 5 key/value pairs
 * const myObjectRecord2: Record<string, MyObject> = generateMyObjectRecord(5);
 *
 * const overrides: GeneratorOverrides<Record<string, MyObject>> = {
 *     one: { key1: "one" },
 *     two: {},
 *     three: undefined,
 * }
 * // The keys of this object will be "one", "two", and "three", and missing properties
 * // in the object's values will be generated
 * const myObjectRecordWithOverrides: Record<string, MyObject> = generateMyObjectRecord(overrides);
 * ```
 *
 * @param keyGenerator Generator function used to generate the object key
 * @param valueGenerator Generator function used to generate the object value
 * @param defaultSize The default size of the object to be generated when no overrides are specified
 */
export function createRecordGenerator<KeyType extends string | number | symbol, ValueType>(
  keyGenerator: BasicGeneratorFn<KeyType>,
  valueGenerator: GeneratorFn<ValueType>,
  defaultSize = 3
): IterableGeneratorFn<Record<KeyType, ValueType>> {
  return (overridesOrSize): Record<KeyType, ValueType> => {
    if (typeof overridesOrSize === "object") {
      const generated: Record<KeyType, ValueType> = {} as Record<KeyType, ValueType>;
      const overrides = overridesOrSize as Record<KeyType, GeneratorOverrides<ValueType>>;
      for (const key in overrides) {
        const overrideValue: GeneratorOverrides<ValueType> = overrides[key];
        if (valueGenerator.length > 0) {
          generated[key] = valueGenerator(overrideValue);
        } else if (overrideValue === undefined) {
          generated[key] = valueGenerator();
        } else {
          generated[key] = overrideValue as ValueType;
        }
      }
      return generated;
    }
    const size = typeof overridesOrSize === "number" ? overridesOrSize : defaultSize;
    const generated: Record<KeyType, ValueType> = {} as Record<KeyType, ValueType>;
    for (let i = 0; i < size; i++) {
      const key: KeyType = keyGenerator();
      generated[key] = valueGenerator();
    }
    return generated;
  };
}
