import { GeneratorFn } from "./GeneratorFn";
import { LeafNode } from "./LeafNode";
import { RequiredNodeGeneratedMode } from "./RequiredNodeGeneratedMode";

/**
 * A generator instruction for a {@link LeafNode}
 */
export type LeafNodeGeneratorInstruction<T extends LeafNode> = GeneratorFn<T> | [RequiredNodeGeneratedMode, GeneratorFn<T>];
