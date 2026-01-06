export enum GeneratorMode {
  /**
   * Default generator mode. If the value is not specified in the overrides, it will be generated.
   */
  INCLUDE = "include",
  /**
   * If the value is not specified in the overrides, it will not be generated.
   */
  OPTIONAL = "optional",
  /**
   * The value will always be generated even if specified in the overrides. Use sparingly.
   */
  FORCE = "force",
}
