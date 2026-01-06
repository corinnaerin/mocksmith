import { LeafNode } from "./LeafNode";

export type ObjOverrides<T> = {
  [P in keyof T]?: GeneratorOverrides<T[P]>;
};

/**
 * Makes all properties recursively optional, allowing a generator function
 * to take in partial overrides to be filled in. An {@link IterableNode}
 * can also be specified as a number instead, to indicate the size of the iterable
 * that should be created, rather than having to pass an an array/map/set of undefined of the desired size.
 */
export type GeneratorOverrides<T> = T extends LeafNode
  ? T | undefined
  : T extends Map<infer MapKey, infer MapValue>
  ? number | undefined | Map<MapKey, GeneratorOverrides<MapValue>>
  : T extends Set<infer SetValue>
  ? number | undefined | Set<GeneratorOverrides<SetValue>>
  : T extends Array<infer ArrayValue>
  ? number | undefined | Array<GeneratorOverrides<ArrayValue>>
  : T extends Record<string | number | symbol, infer ValueType>
  ? number | undefined | Partial<Record<keyof T, GeneratorOverrides<ValueType>>>
  : T extends object
  ? undefined | ObjOverrides<T>
  : never;
