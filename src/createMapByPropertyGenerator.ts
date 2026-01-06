import { GeneratorOverrides } from "./types/GeneratorOverrides";
import { IterableGeneratorFn } from "./types/IterableGeneratorFn";
import { ObjGeneratorFn } from "./types/ObjGeneratorFn";
import { PropertyOfType } from "./types/PropertyOfType";

/**
 * Create a generator that generates a map keyed by specified object's property name.
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
 *    // or you will not be guaranteed a map of the desired size
 *    uniqueId: () => chance.guid(),
 *    other: () => chance.natural()
 * });
 *
 * const generateMyObjectByUniqueIdMap = createMapByPropertyGenerator<MyObject>(
 *     generateMyObject,
 *     "uniqueId",
 *     10
 * );
 *
 * // The keys of this map will equal the "uniqueId" property of MyObject
 * // The map will have 10 key/value pairs
 * const myObjectByUniqueIdMap: Map<string, MyObject> = generateMyObjectByUniqueIdMap();
 *
 * const overrides: GeneratorOverrides<Map<string, MyObject>> = new Map(
 *     ["one", { uniqueId: "one" }],
 *     ["two", {}],
 *     // If the provided object's property does not match the map key,
 *     // it will be overridden to ensure it matches
 *     ["three", { uniqueId: "not matching" }
 * }
 * // The keys of this map will be "one", "two", and "three", and missing properties
 * // in the map's values will be generated
 * const myObjectByUniqueIdMapWithOverrides: Map<string, MyObject> = generateMyObjectByUniqueIdMap(overrides);
 * ```
 *
 * @param generator A plain object generator used to generate the map's values
 * @param keyByProperty The property name which will be used as the map's key
 * @param defaultSize The default size of the map to be generated when no overrides are specified
 */
export function createMapByPropertyGenerator<KeyType, ValueType extends object>(
  generator: ObjGeneratorFn<ValueType>,
  keyByProperty: PropertyOfType<ValueType, KeyType>,
  defaultSize = 3
): IterableGeneratorFn<Map<KeyType, ValueType>> {
  return (overridesOrSize) => {
    if (overridesOrSize instanceof Map) {
      const overrides = overridesOrSize as Map<KeyType, GeneratorOverrides<ValueType>>;
      const generated = new Map<KeyType, ValueType>();
      overrides.forEach((value: GeneratorOverrides<ValueType>, overrideKey: KeyType) => {
        const generatedValue = generator({
          ...value,
          // Ensure the keys match between the map key and the object key
          [keyByProperty]: overrideKey,
        });
        generated.set(overrideKey, generatedValue);
      });
      return generated;
    }
    const size = typeof overridesOrSize === "number" ? overridesOrSize : defaultSize;
    const generated = new Map<KeyType, ValueType>();
    for (let i = 0; i < size; i++) {
      const value = generator();
      // FIXME: I cannot get Typescript to recognize that value[key] is of type KeyType
      //   So for now just casting to unknown first.
      const key = value[keyByProperty] as unknown as KeyType;
      generated.set(key, value);
    }
    return generated;
  };
}
