/**
 * Extracts all keys of an object whose corresponding
 * values are either string, number, or symbol and can therefore be used as a key themselves.
 *
 * Example:
 * ```typescript
 *
 * interface MyInterface {
 *     key1: string;
 *     key2: number;
 *     key3: symbol;
 *     key4: Date;
 *     key5: Record<string, number>;
 * }
 *
 * // Equivalent to "key1" | "key2" | "key3"
 * type MyInterfaceIndexableProperties = IndexablePropertyOf<MyInterface>;
 * ```
 */
export type IndexablePropertyOf<T extends object, P extends string | number | symbol> = Extract<
  {
    [K in keyof T]: T[K] extends P ? K : never;
  }[keyof T],
  string | number | symbol
>;
