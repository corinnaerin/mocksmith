/**
 * This is distinct from the built-in Iterable type, which also includes
 * types like object and string. This is used for generating types that can
 * have an arbitrary size.
 */
export type IterableNode = Map<unknown, unknown> | Array<unknown> | Set<unknown>;
