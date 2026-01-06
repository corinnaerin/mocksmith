import { AnyEnum } from "./types/AnyEnum";
import { BasicGeneratorFn } from "./types/BasicGeneratorFn";
import { enumToArray } from "./utils/enumToArray";

/**
 * Create a generator that generates a random enum value
 *
 * Example:
 * ```typescript
 * enum MyEnum {
 *     ONE,
 *     TWO,
 *     THREE
 * }
 *
 * const generateMyEnum = createEnumGenerator(MyEnum);
 *
 * const myEnum: MyEnum = generateMyEnum();
 * ```
 *
 * @param enumType The enum to randomly generate
 */
export function createEnumGenerator<T extends AnyEnum>(enumType: T): BasicGeneratorFn<T[keyof T]> {
  const enumValues: T[keyof T][] = enumToArray(enumType);
  return (): T[keyof T] => {
    const randomNumber = Math.floor(Math.random() * enumValues.length);
    return enumValues[randomNumber];
  };
}
