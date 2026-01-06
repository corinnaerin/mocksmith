import { GeneratorFn } from "./types/GeneratorFn";
import { GeneratorInstruction } from "./types/GeneratorInstruction";
import { GeneratorMode } from "./types/GeneratorMode";
import { GeneratorOverrides, ObjOverrides } from "./types/GeneratorOverrides";
import { ObjGeneratorFn } from "./types/ObjGeneratorFn";
import { ObjGeneratorTemplate } from "./types/ObjGeneratorTemplate";

function getModeAndGenerator<T>(instruction: GeneratorInstruction<T>): [GeneratorMode, GeneratorFn<T> | undefined] {
  if (Array.isArray(instruction)) {
    return instruction as [GeneratorMode, GeneratorFn<T>];
  }
  if (typeof instruction === "function") {
    return [GeneratorMode.INCLUDE, instruction as GeneratorFn<T>];
  }
  return [instruction as GeneratorMode, undefined];
}

/**
 * Resolve the value for the given key based on the instruction and provided overrides
 */
function resolveProperty<T extends object>(
  key: Extract<keyof T, string>,
  template: ObjGeneratorTemplate<T>,
  overrides?: ObjOverrides<T>
): T[Extract<keyof T, string>] {
  type P = T[Extract<keyof T, string>];
  const instruction = template[key];
  const [mode, generator] = getModeAndGenerator<P>(instruction);

  function generateProperty(override?: GeneratorOverrides<P>): P {
    if (!generator) {
      throw new Error(`Invalid generator instruction for key "${key}": no generator function specified.`);
    }
    if (generator.length > 0) {
      return generator(override) as P;
    }
    return generator() as P;
  }

  if (mode === GeneratorMode.FORCE) {
    return generateProperty();
  }

  if (overrides !== undefined && overrides[key] !== undefined) {
    const override = overrides[key];

    if (generator?.length) {
      // This is a complex generator, so we need to call the nested generator to ensure all
      // properties are handled.
      return generator(override) as P;
    }

    return override as P;
  } else if (mode === GeneratorMode.OPTIONAL) {
    return undefined as unknown as P;
  } else {
    // mode === GeneratorMode.INCLUDE
    return generateProperty();
  }
}

/**
 * Create an object generator function which will recursively generate test data based on the given template,
 * filling in any overrides specified.
 *
 * See the {@link https://static.smart.ninja/storybook/team-common-desktop-experience/data-generation/documentation/mainline/index.html | README } for more information and examples.
 *
 * @param template
 */
export function createObjGenerator<T extends object>(template: ObjGeneratorTemplate<T>): ObjGeneratorFn<T> {
  return (overrides): T => {
    const generated: Partial<T> = {};

    for (const key in template) {
      generated[key] = resolveProperty(key, template, overrides);
    }

    return Object.freeze(generated) as T;
  };
}
