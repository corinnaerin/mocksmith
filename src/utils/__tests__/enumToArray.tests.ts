import { enumToArray } from "../enumToArray";

enum TestNumericEnum {
  ZERO = 0,
  ONE = 1,
  TWO = 2,
}

enum TestStringEnum {
  ZERO = "zero",
  ONE = "one",
  TWO = "two",
}

enum TestMixedEnum {
  ZERO = "zero",
  ONE = 1,
  TWO = "two",
}

describe("enumToArray", () => {
  it("should convert the enum to an array of numeric enum values", () => {
    // Storing this as a variable first as a way of testing that the typecasting is working correctly
    const values: TestNumericEnum[] = enumToArray(TestNumericEnum);
    expect(values).toEqual([0, 1, 2]);
  });

  it("should convert the enum to an array of string enum values", () => {
    const values: TestStringEnum[] = enumToArray(TestStringEnum);
    expect(values).toEqual(["zero", "one", "two"]);
  });

  it("should convert the enum to an array of mixed enum values", () => {
    const values: TestMixedEnum[] = enumToArray(TestMixedEnum);
    expect(values).toEqual(["zero", 1, "two"]);
  });
});
