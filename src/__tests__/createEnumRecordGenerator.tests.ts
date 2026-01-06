import { createArrayGenerator } from "../createArrayGenerator";
import { createEnumRecordGenerator } from "../createEnumRecordGenerator";
import { ObjGeneratorFn } from "../types/ObjGeneratorFn";

describe("createEnumRecordGenerator", () => {
  enum MockNumericEnum {
    ONE = 0,
    TWO = 1,
    THREE = 2,
  }

  enum MockStringEnum {
    ONE = "one",
    TWO = "two",
    THREE = "three",
  }

  const generateEnumRecordValue = jest.fn();
  const generateNumericEnumRecord: ObjGeneratorFn<Record<MockNumericEnum, string>> = createEnumRecordGenerator(
    MockNumericEnum,
    generateEnumRecordValue
  );

  const generateStringEnumRecord: ObjGeneratorFn<Record<MockStringEnum, string>> = createEnumRecordGenerator(
    MockStringEnum,
    generateEnumRecordValue
  );

  const generateEnumToIterableRecord: ObjGeneratorFn<Record<MockStringEnum, string[]>> = createEnumRecordGenerator(
    MockStringEnum,
    createArrayGenerator(generateEnumRecordValue)
  );

  beforeEach(() => {
    generateEnumRecordValue
      .mockReturnValueOnce("generated-1")
      .mockReturnValueOnce("generated-2")
      .mockReturnValueOnce("generated-3")
      .mockReturnValueOnce("generated-4")
      .mockReturnValueOnce("generated-5")
      .mockReturnValueOnce("generated-6")
      .mockReturnValueOnce("generated-7")
      .mockReturnValueOnce("generated-8")
      .mockReturnValueOnce("generated-9");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should generate a record with all numeric enum values when no overrides are specified", () => {
    const generated = generateNumericEnumRecord();
    expect(generated).toMatchObject<Record<MockNumericEnum, string>>({
      [MockNumericEnum.ONE]: "generated-1",
      [MockNumericEnum.TWO]: "generated-2",
      [MockNumericEnum.THREE]: "generated-3",
    });
    expect(generateEnumRecordValue).toHaveBeenCalledTimes(3);
  });

  it("should generate a record with all string enum values when no overrides are specified", () => {
    const generated = generateStringEnumRecord();
    expect(generated).toMatchObject<Record<MockStringEnum, string>>({
      [MockStringEnum.ONE]: "generated-1",
      [MockStringEnum.TWO]: "generated-2",
      [MockStringEnum.THREE]: "generated-3",
    });
    expect(generateEnumRecordValue).toHaveBeenCalledTimes(3);
  });

  it("should generate a record with all numeric enum values when overrides are specified", () => {
    const generated = generateNumericEnumRecord({
      [MockNumericEnum.TWO]: "Override",
    });
    expect(generated).toMatchObject<Record<MockNumericEnum, string>>({
      [MockNumericEnum.ONE]: "generated-1",
      [MockNumericEnum.TWO]: "Override",
      [MockNumericEnum.THREE]: "generated-2",
    });
    expect(generateEnumRecordValue).toHaveBeenCalledTimes(2);
  });

  it("should generate a record with all string enum values when overrides are specified", () => {
    const generated = generateStringEnumRecord({
      [MockStringEnum.TWO]: "Override",
    });
    expect(generated).toMatchObject<Record<MockStringEnum, string>>({
      one: "generated-1",
      two: "Override",
      three: "generated-2",
    });
    expect(generateEnumRecordValue).toHaveBeenCalledTimes(2);
  });

  it("should generate a record with an iterable value type", () => {
    const generated: Record<MockStringEnum, string[]> = generateEnumToIterableRecord();
    expect(generated).toMatchObject<Record<MockStringEnum, string[]>>({
      one: ["generated-1", "generated-2", "generated-3"],
      two: ["generated-4", "generated-5", "generated-6"],
      three: ["generated-7", "generated-8", "generated-9"],
    });
  });

  it("should generate a record with an iterable value type with overrides", () => {
    const generated: Record<MockStringEnum, string[]> = generateEnumToIterableRecord({
      [MockStringEnum.ONE]: ["override-1", "override-2"],
      two: 0,
      three: 3,
    });
    expect(generated).toMatchObject<Record<MockStringEnum, string[]>>({
      one: ["override-1", "override-2"],
      two: [],
      three: ["generated-1", "generated-2", "generated-3"],
    });
  });
});
