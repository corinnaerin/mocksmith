import { createObjGenerator } from "../createObjGenerator";

import { createRecordByPropertyGenerator } from "../createRecordByPropertyGenerator";
import { BasicGeneratorFn } from "../types/BasicGeneratorFn";
import { GeneratorFn } from "../types/GeneratorFn";
import { GeneratorOverrides } from "../types/GeneratorOverrides";

interface MockObject {
  key1: string;
  key2: string;
  key3: Date;
}

describe("createRecordByPropertyGenerator", () => {
  const generateKey1: BasicGeneratorFn<string> = jest.fn();
  const generateKey2: BasicGeneratorFn<string> = jest.fn();
  const generateKey3: BasicGeneratorFn<Date> = jest.fn();

  const generateMockObject = createObjGenerator<MockObject>({
    key1: generateKey1,
    key2: generateKey2,
    key3: generateKey3,
  });

  const now = Date.now();
  const date1 = new Date(now);
  const date2 = new Date(now - 1000);
  const date3 = new Date(now - 2000);
  const date4 = new Date(now - 3000);
  const date5 = new Date(now - 4000);

  beforeEach(() => {
    (generateKey1 as jest.Mock)
      .mockReturnValueOnce("generated-key1-1")
      .mockReturnValueOnce("generated-key1-2")
      .mockReturnValueOnce("generated-key1-3")
      .mockReturnValueOnce("generated-key1-4")
      .mockReturnValueOnce("generated-key1-5");
    (generateKey2 as jest.Mock)
      .mockReturnValueOnce("generated-key2-1")
      .mockReturnValueOnce("generated-key2-2")
      .mockReturnValueOnce("generated-key2-3")
      .mockReturnValueOnce("generated-key2-4")
      .mockReturnValueOnce("generated-key2-5");
    (generateKey3 as jest.Mock)
      .mockReturnValueOnce(date1)
      .mockReturnValueOnce(date2)
      .mockReturnValueOnce(date3)
      .mockReturnValueOnce(date4)
      .mockReturnValueOnce(date5);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should create a Record with the default Record generator size if not specified in the template or overrides", () => {
    const generateMockObjectRecord: GeneratorFn<Record<string, MockObject>> = createRecordByPropertyGenerator(generateMockObject, "key1");
    const generated: Record<string, MockObject> = generateMockObjectRecord();
    expect(generated).toEqual({
      "generated-key1-1": { key1: "generated-key1-1", key2: "generated-key2-1", key3: date1 },
      "generated-key1-2": { key1: "generated-key1-2", key2: "generated-key2-2", key3: date2 },
      "generated-key1-3": { key1: "generated-key1-3", key2: "generated-key2-3", key3: date3 },
    });
    expect(generateKey1).toHaveBeenCalledTimes(3);
    expect(generateKey2).toHaveBeenCalledTimes(3);
    expect(generateKey3).toHaveBeenCalledTimes(3);
  });

  it("should create a Record with the template size if not specified in the overrides", () => {
    const generateMockObjectRecord = createRecordByPropertyGenerator(generateMockObject, "key1", 5);
    const generated = generateMockObjectRecord();
    expect(generated).toEqual({
      "generated-key1-1": { key1: "generated-key1-1", key2: "generated-key2-1", key3: date1 },
      "generated-key1-2": { key1: "generated-key1-2", key2: "generated-key2-2", key3: date2 },
      "generated-key1-3": { key1: "generated-key1-3", key2: "generated-key2-3", key3: date3 },
      "generated-key1-4": { key1: "generated-key1-4", key2: "generated-key2-4", key3: date4 },
      "generated-key1-5": { key1: "generated-key1-5", key2: "generated-key2-5", key3: date5 },
    });
    expect(generateKey1).toHaveBeenCalledTimes(5);
    expect(generateKey2).toHaveBeenCalledTimes(5);
    expect(generateKey3).toHaveBeenCalledTimes(5);
  });

  it("should create a Record the same size as the overrides", () => {
    const generateMockObjectRecord = createRecordByPropertyGenerator(generateMockObject, "key1", 5);
    const generated = generateMockObjectRecord({ one: {}, two: {} });
    expect(generated).toEqual({
      one: { key1: "one", key2: "generated-key2-1", key3: date1 },
      two: { key1: "two", key2: "generated-key2-2", key3: date2 },
    });
    expect(generateKey1).not.toHaveBeenCalled();
    expect(generateKey2).toHaveBeenCalledTimes(2);
    expect(generateKey3).toHaveBeenCalledTimes(2);
  });

  it("should create a Record with the given size", () => {
    const generateMockObjectRecord = createRecordByPropertyGenerator(generateMockObject, "key1", 5);
    const generated = generateMockObjectRecord(4);
    expect(Object.keys(generated)).toHaveLength(4);
    expect(generated).toEqual({
      "generated-key1-1": { key1: "generated-key1-1", key2: "generated-key2-1", key3: date1 },
      "generated-key1-2": { key1: "generated-key1-2", key2: "generated-key2-2", key3: date2 },
      "generated-key1-3": { key1: "generated-key1-3", key2: "generated-key2-3", key3: date3 },
      "generated-key1-4": { key1: "generated-key1-4", key2: "generated-key2-4", key3: date4 },
    });
    expect(generateKey1).toHaveBeenCalledTimes(4);
    expect(generateKey2).toHaveBeenCalledTimes(4);
    expect(generateKey3).toHaveBeenCalledTimes(4);
  });

  it("should recursively generate a Record of objects", () => {
    const generateMockObjectRecord = createRecordByPropertyGenerator<string, MockObject>(generateMockObject, "key1", 5);
    const overrideDate = new Date(now - 5000);
    const overrides: GeneratorOverrides<Record<string, MockObject>> = {
      one: { key2: "value2" },
      two: { key3: overrideDate },
      three: undefined,
    };
    const generated = generateMockObjectRecord(overrides);
    expect(generated).toEqual({
      one: {
        key1: "one",
        key2: "value2",
        key3: date1,
      },
      two: {
        key1: "two",
        key2: "generated-key2-1",
        key3: overrideDate,
      },
      three: {
        key1: "three",
        key2: "generated-key2-2",
        key3: date2,
      },
    });
    expect(generateKey1).not.toHaveBeenCalled();
    expect(generateKey2).toHaveBeenCalledTimes(2);
    expect(generateKey3).toHaveBeenCalledTimes(2);
  });

  it("should ensure that the object's key matches the record's key", () => {
    const generateMockObjectRecord = createRecordByPropertyGenerator(generateMockObject, "key1", 5);
    const generated = generateMockObjectRecord({
      one: { key1: "value2" },
      two: { key1: "value2" },
      three: undefined,
    });
    expect(generated).toEqual({
      one: {
        key1: "one",
        key2: "generated-key2-1",
        key3: date1,
      },
      two: {
        key1: "two",
        key2: "generated-key2-2",
        key3: date2,
      },
      three: {
        key1: "three",
        key2: "generated-key2-3",
        key3: date3,
      },
    });
    expect(generateKey1).not.toHaveBeenCalled();
    expect(generateKey2).toHaveBeenCalledTimes(3);
    expect(generateKey3).toHaveBeenCalledTimes(3);
  });
});
