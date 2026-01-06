import { InstructionGeneratorMode } from "./InstructionGeneratorMode";
import { GeneratorFn } from "./GeneratorFn";
import { IterableNode } from "./IterableNode";

/**
 * A generator instruction for a {@link IterableNode} or plain object.
 * A generator function is always required, unlike in {@link LeafNodeGeneratorInstruction}. This facilitates recursive generation
 * of optional properties.
 */
export type ComplexGeneratorInstruction<T extends IterableNode | object | undefined> =
  | GeneratorFn<Exclude<T, undefined>>
  | [InstructionGeneratorMode<T>, GeneratorFn<Exclude<T, undefined>>];
