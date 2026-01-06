import { createObjGenerator } from "../createObjGenerator";
import { createRecordGenerator } from "../createRecordGenerator";
import { BasicGeneratorFn } from "../types/BasicGeneratorFn";
import { GeneratorFn } from "../types/GeneratorFn";
import { GeneratorOverrides } from "../types/GeneratorOverrides";

interface MockObject {
  key1: string;
  key2: string;
}

describe("createRecordGenerator", () => {
  const generateRecordKey: BasicGeneratorFn<string> = jest.fn();
  const generateObjKey1: BasicGeneratorFn<string> = jest.fn();
  const generateObjKey2: BasicGeneratorFn<string> = jest.fn();
  const generateNumber: BasicGeneratorFn<number> = jest.fn();

  const generateMockObject = createObjGenerator<MockObject>({
    key1: generateObjKey1,
    key2: generateObjKey2,
  });

  beforeEach(() => {
    (generateRecordKey as jest.Mock)
      .mockReturnValueOnce("generatedRecord1")
      .mockReturnValueOnce("generatedRecord2")
      .mockReturnValueOnce("generatedRecord3")
      .mockReturnValueOnce("generatedRecord4")
      .mockReturnValueOnce("generatedRecord5");
    (generateObjKey1 as jest.Mock)
      .mockReturnValueOnce("generated-key1-1")
      .mockReturnValueOnce("generated-key1-2")
      .mockReturnValueOnce("generated-key1-3")
      .mockReturnValueOnce("generated-key1-4")
      .mockReturnValueOnce("generated-key1-5");
    (generateObjKey2 as jest.Mock)
      .mockReturnValueOnce("generated-key2-1")
      .mockReturnValueOnce("generated-key2-2")
      .mockReturnValueOnce("generated-key2-3")
      .mockReturnValueOnce("generated-key2-4")
      .mockReturnValueOnce("generated-key2-5");
    (generateNumber as jest.Mock).mockReturnValueOnce(111).mockReturnValueOnce(222).mockReturnValueOnce(333);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should create a Record with the default Record generator size if not specified in the template or overrides", () => {
    const generateMockObjectRecord: GeneratorFn<Record<string, MockObject>> = createRecordGenerator(generateRecordKey, generateMockObject);
    const generated: Record<string, MockObject> = generateMockObjectRecord();
    expect(generated).toEqual({
      generatedRecord1: { key1: "generated-key1-1", key2: "generated-key2-1" },
      generatedRecord2: { key1: "generated-key1-2", key2: "generated-key2-2" },
      generatedRecord3: { key1: "generated-key1-3", key2: "generated-key2-3" },
    });
    expect(generateRecordKey).toHaveBeenCalledTimes(3);
    expect(generateObjKey1).toHaveBeenCalledTimes(3);
    expect(generateObjKey2).toHaveBeenCalledTimes(3);
  });

  it("should create a Record with the template size if not specified in the overrides", () => {
    const generateMockObjectRecord = createRecordGenerator(generateRecordKey, generateMockObject, 5);
    const generated = generateMockObjectRecord();
    expect(generated).toEqual({
      generatedRecord1: { key1: "generated-key1-1", key2: "generated-key2-1" },
      generatedRecord2: { key1: "generated-key1-2", key2: "generated-key2-2" },
      generatedRecord3: { key1: "generated-key1-3", key2: "generated-key2-3" },
      generatedRecord4: { key1: "generated-key1-4", key2: "generated-key2-4" },
      generatedRecord5: { key1: "generated-key1-5", key2: "generated-key2-5" },
    });
    expect(generateRecordKey).toHaveBeenCalledTimes(5);
    expect(generateObjKey1).toHaveBeenCalledTimes(5);
    expect(generateObjKey2).toHaveBeenCalledTimes(5);
  });

  it("should create a Record the same size as the overrides", () => {
    const generateMockObjectRecord = createRecordGenerator(generateRecordKey, generateMockObject, 5);
    const generated = generateMockObjectRecord({
      one: {},
      two: {},
    });
    expect(generated).toEqual({
      one: { key1: "generated-key1-1", key2: "generated-key2-1" },
      two: { key1: "generated-key1-2", key2: "generated-key2-2" },
    });
    expect(generateRecordKey).not.toHaveBeenCalled();
    expect(generateObjKey1).toHaveBeenCalledTimes(2);
    expect(generateObjKey2).toHaveBeenCalledTimes(2);
  });

  it("should create a Record with the given size", () => {
    const generateMockObjectRecord = createRecordGenerator(generateRecordKey, generateMockObject, 5);
    const generated = generateMockObjectRecord(4);
    expect(generated).toEqual({
      generatedRecord1: { key1: "generated-key1-1", key2: "generated-key2-1" },
      generatedRecord2: { key1: "generated-key1-2", key2: "generated-key2-2" },
      generatedRecord3: { key1: "generated-key1-3", key2: "generated-key2-3" },
      generatedRecord4: { key1: "generated-key1-4", key2: "generated-key2-4" },
    });
    expect(generateRecordKey).toHaveBeenCalledTimes(4);
    expect(generateObjKey1).toHaveBeenCalledTimes(4);
    expect(generateObjKey2).toHaveBeenCalledTimes(4);
  });

  it("should recursively generate a Record of objects", () => {
    const generateMockObjectRecord = createRecordGenerator(generateRecordKey, generateMockObject);
    const generated: Record<string, MockObject> = generateMockObjectRecord({
      one: { key1: "value1" },
      two: { key2: "value2" },
      three: undefined,
    });
    expect(generated).toEqual({
      one: {
        key1: "value1",
        key2: "generated-key2-1",
      },
      two: {
        key1: "generated-key1-1",
        key2: "value2",
      },
      three: {
        key1: "generated-key1-2",
        key2: "generated-key2-2",
      },
    });
    expect(generateRecordKey).not.toHaveBeenCalled();
    expect(generateObjKey1).toHaveBeenCalledTimes(2);
    expect(generateObjKey2).toHaveBeenCalledTimes(2);
  });

  it("should generate a Record of primitives", () => {
    const generateMockNumberRecord = createRecordGenerator(generateRecordKey, generateNumber);
    const generated: Record<string, number> = generateMockNumberRecord();
    expect(generated).toEqual({
      generatedRecord1: 111,
      generatedRecord2: 222,
      generatedRecord3: 333,
    });
  });

  it("should generate a Record of primitives with overrides specified", () => {
    const generateMockNumberRecord = createRecordGenerator(generateRecordKey, generateNumber);
    const generated: Record<string, number> = generateMockNumberRecord({
      one: 1,
      two: undefined,
    });
    expect(generated).toEqual({
      one: 1,
      two: 111,
    });
  });

  it("should generate a Record of primitives with numeric key with overrides specified", () => {
    const generateMockNumberRecord = createRecordGenerator(generateRecordKey, generateNumber);
    const overrides: GeneratorOverrides<Record<number, number>> = {
      [1]: 1,
      [2]: undefined,
    };
    const generated: Record<number, number> = generateMockNumberRecord(overrides);
    expect(generated).toEqual({
      [1]: 1,
      [2]: 111,
    });
  });
});
