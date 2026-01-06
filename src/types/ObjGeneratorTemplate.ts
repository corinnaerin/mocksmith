import { GeneratorInstruction } from "./GeneratorInstruction";

/**
 * A template that dictates how {@link createObjGenerator} should generate the desired object
 *
 * See the {@link https://static.smart.ninja/storybook/team-common-desktop-experience/data-generation/documentation/mainline/index.html | README } for more information and examples.
 *
 */
export type ObjGeneratorTemplate<T extends object> = {
  [P in keyof Required<T>]: GeneratorInstruction<T[P]>;
};
