import { GeneratorFn } from "./GeneratorFn";
import { GeneratorMode } from "./GeneratorMode";
import { OptionalLeafNode } from "./LeafNode";

/**
 * A generator instruction for an optional {@link LeafNode}
 */
export type OptionalLeafNodeGeneratorInstruction<T extends OptionalLeafNode> =
  | GeneratorFn<Exclude<T, undefined>>
  | GeneratorMode.OPTIONAL
  | [GeneratorMode, GeneratorFn<Exclude<T, undefined>>];
