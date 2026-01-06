import { BasicGeneratorFn } from "./BasicGeneratorFn";
import { IterableGeneratorFn } from "./IterableGeneratorFn";
import { IterableNode } from "./IterableNode";
import { LeafNode } from "./LeafNode";
import { ObjGeneratorFn } from "./ObjGeneratorFn";

export type GeneratorFn<T> = [T] extends [LeafNode]
  ? BasicGeneratorFn<T>
  : T extends IterableNode
  ? IterableGeneratorFn<T>
  : T extends Record<string | number | symbol, unknown>
  ? IterableGeneratorFn<T> | ObjGeneratorFn<T>
  : T extends object
  ? ObjGeneratorFn<T>
  : never;
