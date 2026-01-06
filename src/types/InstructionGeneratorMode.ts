import { GeneratorMode } from "./GeneratorMode";
import { RequiredNodeGeneratedMode } from "./RequiredNodeGeneratedMode";

export type InstructionGeneratorMode<T> = T extends undefined ? GeneratorMode : RequiredNodeGeneratedMode;
