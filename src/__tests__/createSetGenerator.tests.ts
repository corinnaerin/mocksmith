import { createObjGenerator } from "../createObjGenerator";
import { createSetGenerator } from "../createSetGenerator";

interface MockObject {
  key1: string;
  key2: string;
}

describe("createSetGenerator", () => {
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

  it("should create a Set with the default Set generator size if not specified in the template or overrides", () => {
    const generateMockObjectSet = createSetGenerator(generateMockObject);
    const generated = generateMockObjectSet();
    expect(generated.size).toBe(3);
    expect(generated).toContainEqual({ key1: "generated-key1-1", key2: "generated-key2-1" });
    expect(generated).toContainEqual({ key1: "generated-key1-2", key2: "generated-key2-2" });
    expect(generated).toContainEqual({ key1: "generated-key1-3", key2: "generated-key2-3" });
    expect(generateKey1).toHaveBeenCalledTimes(3);
    expect(generateKey2).toHaveBeenCalledTimes(3);
  });

  it("should create a Set with the template size if not specified in the overrides", () => {
    const generateMockObjectSet = createSetGenerator(generateMockObject, 5);
    const generated = generateMockObjectSet();
    expect(generated.size).toBe(5);
    expect(generated).toContainEqual({ key1: "generated-key1-1", key2: "generated-key2-1" });
    expect(generated).toContainEqual({ key1: "generated-key1-2", key2: "generated-key2-2" });
    expect(generated).toContainEqual({ key1: "generated-key1-3", key2: "generated-key2-3" });
    expect(generated).toContainEqual({ key1: "generated-key1-4", key2: "generated-key2-4" });
    expect(generated).toContainEqual({ key1: "generated-key1-5", key2: "generated-key2-5" });
    expect(generateKey1).toHaveBeenCalledTimes(5);
    expect(generateKey2).toHaveBeenCalledTimes(5);
  });

  it("should create a Set with the same size as the overrides", () => {
    const generateMockObjectSet = createSetGenerator(generateMockObject);
    const generated = generateMockObjectSet(new Set([{}, {}]));
    expect(generated.size).toBe(2);
    expect(generated).toContainEqual({ key1: "generated-key1-1", key2: "generated-key2-1" });
    expect(generated).toContainEqual({ key1: "generated-key1-2", key2: "generated-key2-2" });
    expect(generateKey1).toHaveBeenCalledTimes(2);
    expect(generateKey2).toHaveBeenCalledTimes(2);
  });

  it("should create a Set with the given size", () => {
    const generateMockObjectSet = createSetGenerator(generateMockObject);
    const generated = generateMockObjectSet(4);
    expect(generated.size).toBe(4);
    expect(generated).toContainEqual({ key1: "generated-key1-1", key2: "generated-key2-1" });
    expect(generated).toContainEqual({ key1: "generated-key1-2", key2: "generated-key2-2" });
    expect(generated).toContainEqual({ key1: "generated-key1-3", key2: "generated-key2-3" });
    expect(generated).toContainEqual({ key1: "generated-key1-4", key2: "generated-key2-4" });
    expect(generateKey1).toHaveBeenCalledTimes(4);
    expect(generateKey2).toHaveBeenCalledTimes(4);
  });

  it("should recursively generate a Set of objects", () => {
    const generateMockObjectSet = createSetGenerator(generateMockObject);
    const generated = generateMockObjectSet(new Set([{ key1: "override-key1" }, { key2: "override-key2" }]));
    expect(generated).toBeInstanceOf(Set);
    expect(Array.from(generated)).toEqual([
      { key1: "override-key1", key2: "generated-key2-1" },
      { key1: "generated-key1-1", key2: "override-key2" },
    ]);
  });

  it("should generate a Set of primitives", () => {
    const generateMockObjectSet = createSetGenerator(generateNumber);
    const generated = generateMockObjectSet();
    expect(generated).toBeInstanceOf(Set);
    expect(generated.size).toBe(3);
    expect(generated).toContain(111);
    expect(generated).toContain(222);
    expect(generated).toContain(333);
  });

  it("should just return the overrides when passed a Set of primitives", () => {
    const generateMockObjectSet = createSetGenerator(generateNumber);
    const generated = generateMockObjectSet(new Set([1, 2, 3]));
    expect(generated).toBeInstanceOf(Set);
    expect(generated.size).toBe(3);
    expect(generated).toContain(1);
    expect(generated).toContain(2);
    expect(generated).toContain(3);
  });
});
