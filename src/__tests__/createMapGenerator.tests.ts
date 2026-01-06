import { createMapGenerator } from "../createMapGenerator";
import { createObjGenerator } from "../createObjGenerator";
import { BasicGeneratorFn } from "../types/BasicGeneratorFn";
import { GeneratorFn } from "../types/GeneratorFn";
import { GeneratorOverrides } from "../types/GeneratorOverrides";

interface MockObject {
  key1: string;
  key2: string;
}

describe("createMapGenerator", () => {
  const generateMapKey: BasicGeneratorFn<string> = jest.fn();
  const generateObjKey1: BasicGeneratorFn<string> = jest.fn();
  const generateObjKey2: BasicGeneratorFn<string> = jest.fn();
  const generateNumber: BasicGeneratorFn<number> = jest.fn();

  const generateMockObject = createObjGenerator<MockObject>({
    key1: generateObjKey1,
    key2: generateObjKey2,
  });

  beforeEach(() => {
    (generateMapKey as jest.Mock)
      .mockReturnValueOnce("generated-map-key-1")
      .mockReturnValueOnce("generated-map-key-2")
      .mockReturnValueOnce("generated-map-key-3")
      .mockReturnValueOnce("generated-map-key-4")
      .mockReturnValueOnce("generated-map-key-5");
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

  it("should create a Map with the default Map generator size if not specified in the template or overrides", () => {
    const generateMockObjectMap: GeneratorFn<Map<string, MockObject>> = createMapGenerator(generateMapKey, generateMockObject);
    const generated: Map<string, MockObject> = generateMockObjectMap();
    expect(generated).toBeInstanceOf(Map);
    expect(generated.size).toBe(3);
    expect(generated.get("generated-map-key-1")).toEqual({ key1: "generated-key1-1", key2: "generated-key2-1" });
    expect(generated.get("generated-map-key-2")).toEqual({ key1: "generated-key1-2", key2: "generated-key2-2" });
    expect(generated.get("generated-map-key-3")).toEqual({ key1: "generated-key1-3", key2: "generated-key2-3" });
    expect(generateMapKey).toHaveBeenCalledTimes(3);
    expect(generateObjKey1).toHaveBeenCalledTimes(3);
    expect(generateObjKey2).toHaveBeenCalledTimes(3);
  });

  it("should create a Map with the template size if not specified in the overrides", () => {
    const generateMockObjectMap = createMapGenerator(generateMapKey, generateMockObject, 5);
    const generated = generateMockObjectMap();
    expect(generated).toBeInstanceOf(Map);
    expect(generated.size).toBe(5);
    expect(generated.get("generated-map-key-1")).toEqual({ key1: "generated-key1-1", key2: "generated-key2-1" });
    expect(generated.get("generated-map-key-2")).toEqual({ key1: "generated-key1-2", key2: "generated-key2-2" });
    expect(generated.get("generated-map-key-3")).toEqual({ key1: "generated-key1-3", key2: "generated-key2-3" });
    expect(generated.get("generated-map-key-4")).toEqual({ key1: "generated-key1-4", key2: "generated-key2-4" });
    expect(generated.get("generated-map-key-5")).toEqual({ key1: "generated-key1-5", key2: "generated-key2-5" });
    expect(generateMapKey).toHaveBeenCalledTimes(5);
    expect(generateObjKey1).toHaveBeenCalledTimes(5);
    expect(generateObjKey2).toHaveBeenCalledTimes(5);
  });

  it("should create a Map the same size as the overrides", () => {
    const generateMockObjectMap = createMapGenerator(generateMapKey, generateMockObject, 5);
    const overrides: GeneratorOverrides<Map<string, MockObject>> = new Map<string, GeneratorOverrides<MockObject>>([
      ["one", {}],
      ["two", undefined],
    ]);
    const generated = generateMockObjectMap(overrides);
    expect(generated).toBeInstanceOf(Map);
    expect(generated.size).toBe(2);
    expect(generated.get("one")).toEqual({ key1: "generated-key1-1", key2: "generated-key2-1" });
    expect(generated.get("two")).toEqual({ key1: "generated-key1-2", key2: "generated-key2-2" });
    expect(generateMapKey).not.toHaveBeenCalled();
    expect(generateObjKey1).toHaveBeenCalledTimes(2);
    expect(generateObjKey2).toHaveBeenCalledTimes(2);
  });

  it("should create a Map with the given size", () => {
    const generateMockObjectMap = createMapGenerator(generateMapKey, generateMockObject, 5);
    const generated = generateMockObjectMap(4);
    expect(generated).toBeInstanceOf(Map);
    expect(generated.size).toBe(4);
    expect(generated.get("generated-map-key-1")).toEqual({ key1: "generated-key1-1", key2: "generated-key2-1" });
    expect(generated.get("generated-map-key-2")).toEqual({ key1: "generated-key1-2", key2: "generated-key2-2" });
    expect(generated.get("generated-map-key-3")).toEqual({ key1: "generated-key1-3", key2: "generated-key2-3" });
    expect(generated.get("generated-map-key-4")).toEqual({ key1: "generated-key1-4", key2: "generated-key2-4" });
    expect(generateMapKey).toHaveBeenCalledTimes(4);
    expect(generateObjKey1).toHaveBeenCalledTimes(4);
    expect(generateObjKey2).toHaveBeenCalledTimes(4);
  });

  it("should recursively generate a Map of objects", () => {
    const generateMockObjectMap = createMapGenerator(generateMapKey, generateMockObject);
    const overrides: GeneratorOverrides<Map<string, MockObject>> = new Map([
      ["one", { key1: "value1" }],
      ["two", { key2: "value2" }],
      ["three", undefined],
    ]);
    const generated = generateMockObjectMap(overrides);
    expect(generated).toBeInstanceOf(Map);
    expect(generated.size).toBe(3);
    expect(generated.get("one")).toEqual({
      key1: "value1",
      key2: "generated-key2-1",
    });
    expect(generated.get("two")).toMatchObject<MockObject>({
      key1: "generated-key1-1",
      key2: "value2",
    });
    expect(generated.get("three")).toMatchObject<MockObject>({
      key1: "generated-key1-2",
      key2: "generated-key2-2",
    });
    expect(generateMapKey).not.toHaveBeenCalled();
    expect(generateObjKey1).toHaveBeenCalledTimes(2);
    expect(generateObjKey2).toHaveBeenCalledTimes(2);
  });

  it("should generate a Map of primitives", () => {
    const generateMockNumberMap: GeneratorFn<Map<string, number>> = createMapGenerator(generateMapKey, generateNumber);
    const generated: Map<string, number> = generateMockNumberMap();
    expect(generated.get("generated-map-key-1")).toEqual(111);
    expect(generated.get("generated-map-key-2")).toEqual(222);
    expect(generated.get("generated-map-key-3")).toEqual(333);
    expect(generateMapKey).toHaveBeenCalledTimes(3);
    expect(generateNumber).toHaveBeenCalledTimes(3);
  });

  it("should generate a Map of primitives with overrides specified", () => {
    const generateMockNumberMap: GeneratorFn<Map<string, number>> = createMapGenerator(generateMapKey, generateNumber);
    const overrides: GeneratorOverrides<Map<string, number>> = new Map([
      ["one", 1],
      ["two", undefined],
    ]);
    const generated = generateMockNumberMap(overrides);
    expect(generated.size).toBe(2);
    expect(generated.get("one")).toBe(1);
    expect(generated.get("two")).toBe(111);
    expect(generateMapKey).not.toHaveBeenCalled();
    expect(generateNumber).toHaveBeenCalledTimes(1);
  });
});
