import { createObjGenerator } from "./createObjGenerator";
import { AnyEnum } from "./types/AnyEnum";
import { GeneratorFn } from "./types/GeneratorFn";
import { GeneratorInstruction } from "./types/GeneratorInstruction";
import { ObjGeneratorFn } from "./types/ObjGeneratorFn";
import { ObjGeneratorTemplate } from "./types/ObjGeneratorTemplate";
import { enumToArray } from "./utils/enumToArray";

/**
 * Create a generator that generates a plain object (Record) keyed by all the enum values.
 *
 * Example:
 *
 * ```typescript
 * enum MyEnum {
 *     ONE,
 *     TWO,
 *     THREE
 * }
 *
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
 * const generateMyEnumRecord = createEnumRecordGenerator(MyEnum, generateMyObject);
 * const myEnumRecord: Record<MyEnum, MyObject = generateMyEnumRecord();
 * ```
 *
 * This is a short cut generator equivalent to using an object generator and manually
 * including every enum mapped to the same generator, which would become cumbersome for
 * large enums:
 *
 * ```
 * const generateMyEnumRecordManually = createObjectGenerator({
 *    [MyEnum.ONE]: generateMyObject,
 *    [MyEnum.TWO]: generateMyObject,
 *    [MyEnum.THREE]: generateMyObject,
 * });
 *```
 *
 * @param enumObj The enum to use as the key
 * @param valueGenerator The generator used to generate the values
 */
export function createEnumRecordGenerator<E extends AnyEnum, T>(
  enumObj: E,
  valueGenerator: GeneratorFn<T>
): ObjGeneratorFn<Record<E[keyof E], T>> {
  type EnumType = E[keyof E];
  type GeneratedRecord = Record<E[keyof E], T>;
  const enumValues: EnumType[] = enumToArray(enumObj);

  const template = enumValues.reduce((_template, enumValue: EnumType) => {
    _template[enumValue] = valueGenerator as GeneratorInstruction<T>;
    return _template;
  }, {} as Record<EnumType, GeneratorInstruction<T>>);

  return createObjGenerator<GeneratedRecord>(template as ObjGeneratorTemplate<GeneratedRecord>);
}
