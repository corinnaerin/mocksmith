/**
 * Extracts all keys of an object whose corresponding
 * values are the given type
 *
 * Example:
 * ```typescript
 *
 * interface MyInterface {
 *     key1: string;
 *     key2: number;
 *     key3: number;
 * }
 *
 * // Equivalent to "key2" | "key3"
 * type NumericProperties = PropertyOfType<MyInterface, number>;
 * ```
 */
export type PropertyOfType<T extends object, P> = Extract<
  {
    [K in keyof T]: T[K] extends P ? K : never;
  }[keyof T],
  string | number | symbol
>;
