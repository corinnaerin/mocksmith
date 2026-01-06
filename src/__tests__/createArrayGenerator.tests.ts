import { createArrayGenerator } from "../createArrayGenerator";
import { createObjGenerator } from "../createObjGenerator";
import { GeneratorFn } from "../types/GeneratorFn";

interface MockObject {
  key1: string;
  key2: string;
}

describe("createArrayGenerator", () => {
  const generateKey1 = jest.fn();
  const generateKey2 = jest.fn();
  const generateNumber = jest.fn();

  const generateMockObject = createObjGenerator<MockObject>({
    key1: generateKey1,
    key2: generateKey2,
  });

  beforeEach(() => {
    generateKey1
      .mockReturnValueOnce("generated-key1-1")
      .mockReturnValueOnce("generated-key1-2")
      .mockReturnValueOnce("generated-key1-3")
      .mockReturnValueOnce("generated-key1-4")
      .mockReturnValueOnce("generated-key1-5");
    generateKey2
      .mockReturnValueOnce("generated-key2-1")
      .mockReturnValueOnce("generated-key2-2")
      .mockReturnValueOnce("generated-key2-3")
      .mockReturnValueOnce("generated-key2-4")
      .mockReturnValueOnce("generated-key2-5");
    generateNumber.mockReturnValueOnce(111).mockReturnValueOnce(222).mockReturnValueOnce(333);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should create an array with the default array generator size if not specified in the template or overrides", () => {
    const generateMockObjectArray: GeneratorFn<MockObject[]> = createArrayGenerator(generateMockObject);
    const generated: MockObject[] = generateMockObjectArray();
    expect(generated).toBeArrayOfSize(3);
    expect(generated).toEqual([
      { key1: "generated-key1-1", key2: "generated-key2-1" },
      { key1: "generated-key1-2", key2: "generated-key2-2" },
      { key1: "generated-key1-3", key2: "generated-key2-3" },
    ]);
    expect(generateKey1).toHaveBeenCalledTimes(3);
    expect(generateKey2).toHaveBeenCalledTimes(3);
  });

  it("should create an array with the template size if not specified in the overrides", () => {
    const generateMockObjectArray: GeneratorFn<MockObject[]> = createArrayGenerator(generateMockObject, 5);
    const generated: MockObject[] = generateMockObjectArray();
    expect(generated).toBeArrayOfSize(5);
    expect(generated).toEqual([
      { key1: "generated-key1-1", key2: "generated-key2-1" },
      { key1: "generated-key1-2", key2: "generated-key2-2" },
      { key1: "generated-key1-3", key2: "generated-key2-3" },
      { key1: "generated-key1-4", key2: "generated-key2-4" },
      { key1: "generated-key1-5", key2: "generated-key2-5" },
    ]);
    expect(generateKey1).toHaveBeenCalledTimes(5);
    expect(generateKey2).toHaveBeenCalledTimes(5);
  });

  it("should create an array the same size as the overrides", () => {
    const generateMockObjectArray = createArrayGenerator(generateMockObject, 5);
    const generated = generateMockObjectArray([{}, {}]);
    expect(generated).toBeArrayOfSize(2);
    expect(generated).toEqual([
      { key1: "generated-key1-1", key2: "generated-key2-1" },
      { key1: "generated-key1-2", key2: "generated-key2-2" },
    ]);
    expect(generateKey1).toHaveBeenCalledTimes(2);
    expect(generateKey2).toHaveBeenCalledTimes(2);
  });

  it("should create an array of the given size", () => {
    const generateMockObjectArray = createArrayGenerator(generateMockObject, 5);
    const generated = generateMockObjectArray(4);
    expect(generated).toBeArrayOfSize(4);
    expect(generated).toEqual([
      { key1: "generated-key1-1", key2: "generated-key2-1" },
      { key1: "generated-key1-2", key2: "generated-key2-2" },
      { key1: "generated-key1-3", key2: "generated-key2-3" },
      { key1: "generated-key1-4", key2: "generated-key2-4" },
    ]);
    expect(generateKey1).toHaveBeenCalledTimes(4);
    expect(generateKey2).toHaveBeenCalledTimes(4);
  });

  it("should recursively generate an array of objects", () => {
    const generateMockObjectArray = createArrayGenerator(generateMockObject);
    const generated = generateMockObjectArray([{ key1: "foo" }, { key2: "bar" }]);
    expect(generated).toBeArrayOfObjects();
    expect(generated).toEqual([
      { key1: "foo", key2: "generated-key2-1" },
      { key1: "generated-key1-1", key2: "bar" },
    ]);
    expect(generateKey1).toHaveBeenCalledTimes(1);
    expect(generateKey2).toHaveBeenCalledTimes(1);
  });

  it("should recursively generate an array of objects with shared overrides", () => {
    const generateMockObjectArray = createArrayGenerator(generateMockObject);
    const generated = generateMockObjectArray({
      size: 3,
      sharedOverrides: {
        key1: "shared",
      },
    });
    expect(generated).toBeArrayOfObjects();
    expect(generated).toEqual([
      { key1: "shared", key2: "generated-key2-1" },
      { key1: "shared", key2: "generated-key2-2" },
      { key1: "shared", key2: "generated-key2-3" },
    ]);
    expect(generateKey1).toHaveBeenCalledTimes(0);
    expect(generateKey2).toHaveBeenCalledTimes(3);
  });

  it("should generate an array of primitives", () => {
    const generateMockNumberArray: GeneratorFn<number[]> = createArrayGenerator<number>(generateNumber);
    const generated: number[] = generateMockNumberArray();
    expect(generated).toBeArrayOfNumbers();
    expect(generated).toEqual([111, 222, 333]);
    expect(generateNumber).toHaveBeenCalledTimes(3);
  });

  it("should generate an array of primitives when passed a partial array", () => {
    const generateMockNumberArray: GeneratorFn<number[]> = createArrayGenerator<number>(generateNumber);
    const generated: number[] = generateMockNumberArray([undefined, 2, undefined]);
    expect(generated).toHaveLength(3);
    expect(generated).toBeArrayOfNumbers();
    expect(generated).toEqual([111, 2, 222]);
    expect(generateNumber).toHaveBeenCalledTimes(2);
  });
});
