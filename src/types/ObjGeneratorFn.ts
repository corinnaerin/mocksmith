import { GeneratorOverrides } from "./GeneratorOverrides";

/**
 * A generator function for generating a plain object
 */
export type ObjGeneratorFn<T extends object> = (overrides?: GeneratorOverrides<T>) => T;
