import { AnyEnum } from "../types/AnyEnum";
import { enumToObject } from "./enumToObject";

/**
 * Convert an enum into an array of all enum values
 *
 * e.g.
 * ```
 * enum TestEnum {
 *     ZERO = 0,
 *     ONE = 1,
 *     TWO = 2,
 * }
 *
 * // Includes the enum's named keys as well as the values
 * // Causing duplication when trying to iterate over all possible enum values
 * Object.values(TestEnum) === [0, 1, 2, "ZERO", "ONE", "TWO"];
 *
 * // vs. enumToArray which returns only the enum values
 * enumToArray(TestEnum) === [0, 1, 2];
 * ```
 */
export function enumToArray<T extends AnyEnum>(anyEnum: T): T[keyof T][] {
  const enumObj = enumToObject<T>(anyEnum);
  return Object.values(enumObj);
}
