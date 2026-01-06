import { createEnumGenerator } from "../createEnumGenerator";
import { GeneratorFn } from "../types/GeneratorFn";

enum MockNumericEnum {
  ONE,
  TWO,
  THREE,
}

enum MockStringEnum {
  ONE = "one",
  TWO = "two",
  THREE = "three",
}

describe("createEnumGenerator", () => {
  it("should randomly select a numeric enum value", () => {
    const generator: GeneratorFn<MockNumericEnum> = createEnumGenerator(MockNumericEnum);
    const value = generator();
    expect(value).toBeNumber();
    expect(value === 0 || value === 1 || value === 2).toBeTrue();
  });

  it("should randomly select a string enum value", () => {
    const generator: GeneratorFn<MockStringEnum> = createEnumGenerator(MockStringEnum);
    const value: MockStringEnum = generator();
    expect(value).toBeString();
    expect(value === "one" || value === "two" || value === "three").toBeTrue();
  });
});
