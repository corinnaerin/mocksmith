import { EnumObject } from "../../types/EnumObject";
import { enumToObject } from "../enumToObject";

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

describe("enumToObject", () => {
  it("should convert the enum to an object without the reverse mappings for numeric enums", () => {
    // This is what the original enum object looks like
    expect(TestNumericEnum).toEqual({
      ZERO: 0,
      ONE: 1,
      TWO: 2,
      0: "ZERO",
      1: "ONE",
      2: "TWO",
    });

    // Storing this as a variable first as a way of testing that the typecasting is working correctly
    const obj: EnumObject<TestNumericEnum> = enumToObject(TestNumericEnum);
    expect(obj).toEqual({
      ZERO: 0,
      ONE: 1,
      TWO: 2,
    });
  });

  it("should return the enum as-is for string enums", () => {
    // For string-based enums, the function won't actually alter the default, because
    // there are no reverse mappings
    expect(TestStringEnum).toEqual({
      ZERO: "zero",
      ONE: "one",
      TWO: "two",
    });

    const obj: EnumObject<TestStringEnum> = enumToObject(TestStringEnum);
    expect(obj).toEqual({
      ZERO: "zero",
      ONE: "one",
      TWO: "two",
    });
  });

  it("should convert the enum to an object without the reverse mappings for mixed enums", () => {
    expect(TestMixedEnum).toEqual({
      ZERO: "zero",
      ONE: 1,
      TWO: "two",
      1: "ONE",
    });
    const obj: EnumObject<TestMixedEnum> = enumToObject(TestMixedEnum);
    expect(obj).toEqual({
      ZERO: "zero",
      ONE: 1,
      TWO: "two",
    });
  });
});
