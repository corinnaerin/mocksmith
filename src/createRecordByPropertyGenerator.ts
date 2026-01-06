import { GeneratorOverrides } from "./types/GeneratorOverrides";
import { IndexablePropertyOf } from "./types/IndexablePropertyOf";
import { IterableGeneratorFn } from "./types/IterableGeneratorFn";
import { ObjGeneratorFn } from "./types/ObjGeneratorFn";

/**
 * Create a generator that generates a plain object (Record) keyed by specified object's property name.
 *
 * Example:
 *
 * ```typescript
 * interface MyObject {
 *     uniqueId: string;
 *     other: number;
 * }
 *
 * const generateMyObject = createObjectGenerator({
 *    // You must ensure that the generator for the keyByProperty returns a unique result
 *    // or you will not be guaranteed an object of the desired size
 *    uniqueId: () => chance.guid(),
 *    other: () => chance.natural()
 * });
 *
 * const generateMyObjectByUniqueId = createMapByPropertyGenerator<MyObject>(
 *     generateMyObject,
 *     "uniqueId",
 *     10
 * );
 *
 * // The keys of this object will equal the "uniqueId" property of MyObject
 * // The object will have 10 key/value pairs
 * const myObjectByUniqueId: Record<string, MyObject> = generateMyObjectByUniqueId();
 *
 * const overrides: GeneratorOverrides<Record<string, MyObject>> = {
 *     one: { uniqueId: "one" },
 *     two: {},
 *     // If the provided object's property does not match the object key,
 *     // it will be overridden to ensure it matches
 *     three: { uniqueId: "not matching" }
 * }
 * // The keys of this object will be "one", "two", and "three", and missing properties
 * // in the object's values will be generated
 * const myObjectByUniqueIdWithOverrides: Map<string, MyObject> = generateMyObjectByUniqueId(overrides);
 * ```
 *
 * @param generator A plain object generator used to generate the object's values
 * @param keyByProperty The property name which will be used as the object's key
 * @param defaultSize The default size of the object to be generated when no overrides are specified
 */
export function createRecordByPropertyGenerator<KeyType extends string | number | symbol, ValueType extends object>(
  generator: ObjGeneratorFn<ValueType>,
  keyByProperty: IndexablePropertyOf<ValueType, KeyType>,
  defaultSize = 3
): IterableGeneratorFn<Record<KeyType, ValueType>> {
  return (overridesOrSize) => {
    if (typeof overridesOrSize === "object") {
      const overrides = overridesOrSize as Record<KeyType, GeneratorOverrides<ValueType>>;
      const generated: Record<KeyType, ValueType> = {} as Record<KeyType, ValueType>;
      for (const overrideKey in overrides) {
        const overrideValue = overrides[overrideKey];
        generated[overrideKey] = generator({
          ...overrideValue,
          // Ensure the keys match between the Record key and the object key
          [keyByProperty]: overrideKey,
        });
      }
      return generated;
    }
    const size = typeof overridesOrSize === "number" ? overridesOrSize : defaultSize;
    const generated: Record<KeyType, ValueType> = {} as Record<KeyType, ValueType>;
    for (let i = 0; i < size; i++) {
      const value: ValueType = generator();
      // FIXME: I cannot get Typescript to recognize that value[key] is of type KeyType
      //   So for now just casting to unknown first.
      const valueKey = value[keyByProperty] as unknown as KeyType;
      generated[valueKey] = value;
    }
    return generated;
  };
}
