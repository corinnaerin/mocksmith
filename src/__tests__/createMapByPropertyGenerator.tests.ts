import { createMapByPropertyGenerator } from "../createMapByPropertyGenerator";
import { createObjGenerator } from "../createObjGenerator";
import { BasicGeneratorFn } from "../types/BasicGeneratorFn";
import { GeneratorFn } from "../types/GeneratorFn";
import { GeneratorOverrides } from "../types/GeneratorOverrides";

interface MockObject {
  key1: string;
  key2: string;
  key3: Date;
}

describe("createMapByPropertyGenerator", () => {
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

  it("should create a Map with the default Map generator size if not specified in the template or overrides", () => {
    const generateMockObjectMap: GeneratorFn<Map<string, MockObject>> = createMapByPropertyGenerator<string, MockObject>(
      generateMockObject,
      "key1"
    );
    const generated: Map<string, MockObject> = generateMockObjectMap();
    expect(generated).toBeInstanceOf(Map);
    expect(generated.size).toBe(3);
    expect(generated.get("generated-key1-1")).toEqual({ key1: "generated-key1-1", key2: "generated-key2-1", key3: date1 });
    expect(generated.get("generated-key1-2")).toEqual({ key1: "generated-key1-2", key2: "generated-key2-2", key3: date2 });
    expect(generated.get("generated-key1-3")).toEqual({ key1: "generated-key1-3", key2: "generated-key2-3", key3: date3 });
    expect(generateKey1).toHaveBeenCalledTimes(3);
    expect(generateKey2).toHaveBeenCalledTimes(3);
    expect(generateKey3).toHaveBeenCalledTimes(3);
  });

  it("should create a Map with the template size if not specified in the overrides", () => {
    const generateMockObjectMap = createMapByPropertyGenerator(generateMockObject, "key1", 5);
    const generated = generateMockObjectMap();
    expect(generated).toBeInstanceOf(Map);
    expect(generated.size).toBe(5);
    expect(generated.get("generated-key1-1")).toEqual({ key1: "generated-key1-1", key2: "generated-key2-1", key3: date1 });
    expect(generated.get("generated-key1-2")).toEqual({ key1: "generated-key1-2", key2: "generated-key2-2", key3: date2 });
    expect(generated.get("generated-key1-3")).toEqual({ key1: "generated-key1-3", key2: "generated-key2-3", key3: date3 });
    expect(generated.get("generated-key1-4")).toEqual({ key1: "generated-key1-4", key2: "generated-key2-4", key3: date4 });
    expect(generated.get("generated-key1-5")).toEqual({ key1: "generated-key1-5", key2: "generated-key2-5", key3: date5 });
    expect(generateKey1).toHaveBeenCalledTimes(5);
    expect(generateKey2).toHaveBeenCalledTimes(5);
    expect(generateKey3).toHaveBeenCalledTimes(5);
  });

  it("should create a Map the same size as the overrides", () => {
    const generateMockObjectMap = createMapByPropertyGenerator(generateMockObject, "key1", 5);
    const generated = generateMockObjectMap(
      new Map<string, Partial<MockObject>>([
        ["one", {}],
        ["two", {}],
      ])
    );
    expect(generated).toBeInstanceOf(Map);
    expect(generated.size).toBe(2);
    expect(generated.get("one")).toEqual({ key1: "one", key2: "generated-key2-1", key3: date1 });
    expect(generated.get("two")).toEqual({ key1: "two", key2: "generated-key2-2", key3: date2 });
    expect(generateKey1).not.toHaveBeenCalled();
    expect(generateKey2).toHaveBeenCalledTimes(2);
    expect(generateKey3).toHaveBeenCalledTimes(2);
  });

  it("should create a Map with the given size", () => {
    const generateMockObjectMap = createMapByPropertyGenerator(generateMockObject, "key1", 5);
    const generated = generateMockObjectMap(4);
    expect(generated).toBeInstanceOf(Map);
    expect(generated.size).toBe(4);
    expect(generated.get("generated-key1-1")).toEqual({ key1: "generated-key1-1", key2: "generated-key2-1", key3: date1 });
    expect(generated.get("generated-key1-2")).toEqual({ key1: "generated-key1-2", key2: "generated-key2-2", key3: date2 });
    expect(generated.get("generated-key1-3")).toEqual({ key1: "generated-key1-3", key2: "generated-key2-3", key3: date3 });
    expect(generated.get("generated-key1-4")).toEqual({ key1: "generated-key1-4", key2: "generated-key2-4", key3: date4 });
    expect(generateKey1).toHaveBeenCalledTimes(4);
    expect(generateKey2).toHaveBeenCalledTimes(4);
    expect(generateKey3).toHaveBeenCalledTimes(4);
  });

  it("should create a Map with a Date key", () => {
    const generateMockObjectMap: GeneratorFn<Map<Date, MockObject>> = createMapByPropertyGenerator(generateMockObject, "key3");
    const generated = generateMockObjectMap();
    expect(generated).toBeInstanceOf(Map);
    expect(generated.size).toBe(3);
    expect(generated.get(date1)).toEqual({ key1: "generated-key1-1", key2: "generated-key2-1", key3: date1 });
    expect(generated.get(date2)).toEqual({ key1: "generated-key1-2", key2: "generated-key2-2", key3: date2 });
    expect(generated.get(date3)).toEqual({ key1: "generated-key1-3", key2: "generated-key2-3", key3: date3 });
    expect(generateKey1).toHaveBeenCalledTimes(3);
    expect(generateKey2).toHaveBeenCalledTimes(3);
    expect(generateKey3).toHaveBeenCalledTimes(3);
  });

  it("should recursively generate a Map of objects", () => {
    const generateMockObjectMap = createMapByPropertyGenerator(generateMockObject, "key1", 5);
    const newDate = new Date();
    const generated = generateMockObjectMap(
      new Map<string, Partial<MockObject>>([
        ["one", { key2: "value2" }],
        ["two", { key3: newDate }],
      ])
    );
    expect(generated).toBeInstanceOf(Map);
    expect(generated.size).toBe(2);
    expect(generated.get("one")).toEqual({
      key1: "one",
      key2: "value2",
      key3: date1,
    });
    expect(generated.get("two")).toMatchObject<MockObject>({
      key1: "two",
      key2: "generated-key2-1",
      key3: newDate,
    });
    expect(generateKey1).not.toHaveBeenCalled();
    expect(generateKey2).toHaveBeenCalledTimes(1);
    expect(generateKey3).toHaveBeenCalledTimes(1);
  });

  it("should ensure that the object's key matches the map's key", () => {
    const generateMockObjectMap = createMapByPropertyGenerator(generateMockObject, "key1", 5);
    const overrides: GeneratorOverrides<Map<string, MockObject>> = new Map([
      ["one", { key1: "value2" }],
      ["two", { key1: "value2" }],
      ["three", undefined],
    ]);
    const generated = generateMockObjectMap(overrides);
    expect(generated).toBeInstanceOf(Map);
    expect(generated.size).toBe(3);
    expect(generated.get("one")).toEqual({ key1: "one", key2: "generated-key2-1", key3: date1 });
    expect(generated.get("two")).toEqual({ key1: "two", key2: "generated-key2-2", key3: date2 });
    expect(generated.get("three")).toEqual({ key1: "three", key2: "generated-key2-3", key3: date3 });
  });
});
