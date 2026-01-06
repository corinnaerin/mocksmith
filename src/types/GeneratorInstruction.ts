import { ComplexGeneratorInstruction } from "./ComplexGeneratorInstruction";
import { IterableNode } from "./IterableNode";
import { LeafNode, OptionalLeafNode } from "./LeafNode";
import { LeafNodeGeneratorInstruction } from "./LeafNodeGeneratorInstruction";
import { OptionalLeafNodeGeneratorInstruction } from "./OptionalLeafNodeGeneratorInstruction";

export type GeneratorInstruction<T> = [T] extends [LeafNode]
  ? LeafNodeGeneratorInstruction<T>
  : [T] extends [OptionalLeafNode]
  ? OptionalLeafNodeGeneratorInstruction<T>
  : [T] extends [object | IterableNode | undefined]
  ? ComplexGeneratorInstruction<T>
  : never;
