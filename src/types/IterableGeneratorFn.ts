import { GeneratorOverrides } from "./GeneratorOverrides";
import { IterableNode } from "./IterableNode";

/**
 * A generator function for generating a data of a variable size
 */
export type IterableGeneratorFn<T extends Record<string | number | symbol, unknown> | IterableNode> = (
  overridesOrSize?: GeneratorOverrides<T> | number
) => T;

export interface IterableGeneratorOptions<T> {
  size: number;
  sharedOverrides: GeneratorOverrides<T>;
}

export type ArrayGeneratorFn<T> = (overrides?: number | GeneratorOverrides<T[]> | IterableGeneratorOptions<T>) => T[];
