import { GeneratorMode } from "./GeneratorMode";

export type RequiredNodeGeneratedMode = Exclude<GeneratorMode, GeneratorMode.OPTIONAL>;
