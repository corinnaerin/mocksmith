import { LeafNode } from "./LeafNode";

/**
 * A basic generator function for generating a {@link LeafNode}
 */
export type BasicGeneratorFn<T extends LeafNode> = () => T;
