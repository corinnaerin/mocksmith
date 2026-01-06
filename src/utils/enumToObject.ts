import { AnyEnum } from "../types/AnyEnum";
import { EnumObject } from "../types/EnumObject";

/**
 * Return an object version of the specified enum, without reverse mappings
 *
 * e.g.
 * ```typescript
 * enum TestEnum {
 *     ZERO = 0,
 *     ONE = 1,
 *     TWO = 2,
 * }
 * ```
 *
 * is actually implemented as:
 *
 * ```json
 * {
 *      ZERO: 0,
 *      ONE: 1,
 *      TWO: 2,
 *      0: "ZERO",
 *      1: "ONE",
 *      2: "TWO",
 *  }
 * ```
 *
 * This function would return:
 * ```json
 * {
 *      ZERO: 0,
 *      ONE: 1,
 *      TWO: 2,
 *  }
 * ```
 */
export function enumToObject<T extends AnyEnum>(anyEnum: T): EnumObject<T[keyof T]> {
  // An enum object is a mapping in both directions iff the value is a string:
  // key[string] => value[string]
  // key[string] => value[number]
  // value[number] => key[string]
  // We need to filter out the duplicate mappings of value => key
  const allKeys: string[] = Object.keys(anyEnum);
  // Filter out any reverse mappings (of value => key)
  const stringKeys = allKeys.filter((key) => isNaN(parseInt(key)));
  const newObject: { [key: string]: T[keyof T] } = {};
  return stringKeys.reduce((obj, key) => {
    obj[key] = anyEnum[key] as T[keyof T];
    return obj;
  }, newObject);
}
