import { createArrayGenerator } from "../createArrayGenerator";
import { createEnumGenerator } from "../createEnumGenerator";
import { createObjGenerator } from "../createObjGenerator";
import { createRecordGenerator } from "../createRecordGenerator";
import { GeneratorFn } from "../types/GeneratorFn";
import { GeneratorMode } from "../types/GeneratorMode";
import { GeneratorOverrides } from "../types/GeneratorOverrides";
import { ObjGeneratorFn } from "../types/ObjGeneratorFn";

enum MockEnum {
  ONE,
  TWO,
  THREE,
}

interface MockNestedObject {
  primitive: number;
  optionalPrimitive?: number;
  nullablePrimitive: number | null;
}

describe("createObjGenerator", () => {
  const generateMockNestedObject = createObjGenerator<MockNestedObject>({
    primitive: () => 111,
    optionalPrimitive: GeneratorMode.OPTIONAL,
    nullablePrimitive: () => 222,
  });

  describe("GeneratorMode=OPTIONAL", () => {
    interface WithOptionalPrimitive {
      optionalString?: string;
    }

    interface WithOptionalEnum {
      optionalEnum?: MockEnum;
    }

    interface WithNestedOptionalObject {
      optionalObject?: MockNestedObject;
    }

    const generateObjWithOptionalPrimitive = createObjGenerator<WithOptionalPrimitive>({
      optionalString: GeneratorMode.OPTIONAL,
    });
    const generateObjWithOptionalEnum = createObjGenerator<WithOptionalEnum>({
      optionalEnum: GeneratorMode.OPTIONAL,
    });
    const generateObjWithNestedOptionalObject = createObjGenerator<WithNestedOptionalObject>({
      optionalObject: [GeneratorMode.OPTIONAL, generateMockNestedObject],
    });

    it("should not generate a primitive property if not included in the overrides", () => {
      const generated = generateObjWithOptionalPrimitive();
      expect(generated).toMatchObject<WithOptionalPrimitive>({
        optionalString: undefined,
      });
    });

    it("should not generate an enum property if not included in the overrides", () => {
      const generated = generateObjWithOptionalEnum();
      expect(generated).toMatchObject<WithOptionalEnum>({
        optionalEnum: undefined,
      });
    });

    it("should use the primitive property if included in the overrides", () => {
      const generated = generateObjWithOptionalPrimitive({
        optionalString: "foo",
      });
      expect(generated).toMatchObject<WithOptionalPrimitive>({
        optionalString: "foo",
      });
    });

    it("should use the enum property if included in the overrides", () => {
      const generated = generateObjWithOptionalEnum({
        optionalEnum: MockEnum.ONE,
      });
      expect(generated).toMatchObject<WithOptionalEnum>({
        optionalEnum: MockEnum.ONE,
      });
    });

    it("should not generate a nested object property if not included in the overrides", () => {
      const generated = generateObjWithNestedOptionalObject();
      expect(generated).toMatchObject<WithNestedOptionalObject>({
        optionalObject: undefined,
      });
    });

    it("should recursively generate a nested object if an empty object is included in the overrides", () => {
      const generated = generateObjWithNestedOptionalObject({
        optionalObject: {},
      });
      expect(generated).toMatchObject<WithNestedOptionalObject>({
        optionalObject: {
          optionalPrimitive: undefined,
          primitive: 111,
          nullablePrimitive: 222,
        },
      });
    });

    it("should use the nested object's properties if included in the overrides", () => {
      const generated = generateObjWithNestedOptionalObject({
        optionalObject: {
          optionalPrimitive: 555,
          primitive: undefined,
          nullablePrimitive: null,
        },
      });
      expect(generated).toMatchObject({
        optionalObject: {
          optionalPrimitive: 555,
          primitive: 111,
          nullablePrimitive: null,
        },
      });
    });
  });

  describe("GeneratorMode=FORCE", () => {
    it("should always generate a property even if specified in the overrides", () => {
      interface MockObject {
        primitive: number;
        object: MockNestedObject;
        enum: MockEnum;
      }

      const generateMockObject = createObjGenerator<MockObject>({
        primitive: [GeneratorMode.FORCE, () => 1],
        object: [
          GeneratorMode.FORCE,
          () => ({
            optionalPrimitive: undefined,
            primitive: 3,
            nullablePrimitive: null,
          }),
        ],
        enum: [GeneratorMode.FORCE, () => MockEnum.THREE],
      });

      const generated = generateMockObject({
        primitive: -1,
        object: {
          optionalPrimitive: -2,
          primitive: -3,
          nullablePrimitive: -4,
        },
        enum: MockEnum.ONE,
      });
      expect(generated).toMatchObject<MockObject>({
        primitive: 1,
        object: {
          optionalPrimitive: undefined,
          primitive: 3,
          nullablePrimitive: null,
        },
        enum: MockEnum.THREE,
      });
    });
  });

  describe("GeneratorMode=INCLUDE", () => {
    interface WithPrimitive {
      string: string;
    }

    interface WithNestedObject {
      object: MockNestedObject;
    }

    interface WithEnum {
      enum: MockEnum;
    }

    interface WithArray {
      array: string[];
    }

    interface WithStringToNumberRecord {
      record: Record<string, number>;
    }

    interface WithNumberToObjectRecord {
      record: Record<number, MockNestedObject>;
    }

    const generateString: GeneratorFn<string> = jest.fn();
    const generateNumber: GeneratorFn<number> = jest.fn();

    const generateObjWithPrimitive = createObjGenerator<WithPrimitive>({
      string: generateString,
    });
    const generateObjWithNestedObject = createObjGenerator<WithNestedObject>({
      object: generateMockNestedObject,
    });
    const generateObjWithEnum = createObjGenerator<WithEnum>({
      enum: () => MockEnum.THREE,
    });
    const generateObjWithArray: ObjGeneratorFn<WithArray> = createObjGenerator<WithArray>({
      array: createArrayGenerator<string>(generateString),
    });
    const generateObjWithStringToNumberRecord = createObjGenerator<WithStringToNumberRecord>({
      record: createRecordGenerator<string, number>(generateString, generateNumber),
    });
    const generateObjWithNumberToObjectRecord = createObjGenerator<WithNumberToObjectRecord>({
      record: createRecordGenerator(generateNumber, generateMockNestedObject),
    });

    beforeEach(() => {
      (generateString as jest.Mock).mockReturnValueOnce("one").mockReturnValueOnce("two").mockReturnValueOnce("three");
      (generateNumber as jest.Mock).mockReturnValueOnce(1).mockReturnValueOnce(2).mockReturnValueOnce(3);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("should generate a primitive property if not included in the overrides", () => {
      const generated = generateObjWithPrimitive();
      expect(generated).toMatchObject<WithPrimitive>({
        string: "one",
      });
    });

    it("should use the primitive property if included in the overrides", () => {
      const generated = generateObjWithPrimitive({
        string: "bar",
      });
      expect(generated).toMatchObject<WithPrimitive>({
        string: "bar",
      });
    });

    it("should generate an enum property if not included in the overrides", () => {
      const generated = generateObjWithEnum();
      expect(generated).toMatchObject<WithEnum>({
        enum: MockEnum.THREE,
      });
    });

    it("should use the enum property if included in the overrides", () => {
      const generated = generateObjWithEnum({
        enum: MockEnum.TWO,
      });
      expect(generated).toMatchObject<WithEnum>({
        enum: MockEnum.TWO,
      });
    });

    it("should generate a nested object property if not included in the overrides", () => {
      const generated = generateObjWithNestedObject();
      expect(generated).toMatchObject<WithNestedObject>({
        object: {
          primitive: 111,
          optionalPrimitive: undefined,
          nullablePrimitive: 222,
        },
      });
    });

    it("should recursively generate a nested object if an empty object is included in the overrides", () => {
      const generated = generateObjWithNestedObject({
        object: {},
      });
      expect(generated).toMatchObject<WithNestedObject>({
        object: {
          primitive: 111,
          optionalPrimitive: undefined,
          nullablePrimitive: 222,
        },
      });
    });

    it("should use the nested object's properties if included in the overrides", () => {
      const generated = generateObjWithNestedObject({
        object: {
          optionalPrimitive: undefined,
          primitive: 123,
          nullablePrimitive: null,
        },
      });
      expect(generated).toMatchObject<WithNestedObject>({
        object: {
          optionalPrimitive: undefined,
          primitive: 123,
          nullablePrimitive: null,
        },
      });
    });

    it("should generate an object with an array", () => {
      const generated = generateObjWithArray();
      expect(generated).toMatchObject<WithArray>({
        array: ["one", "two", "three"],
      });
    });

    it("should generate an object with an array with the given overrides", () => {
      const overrides: GeneratorOverrides<string[]> = ["foo", "bar", undefined];
      const generated = generateObjWithArray({ array: overrides });
      expect(generated).toMatchObject<WithArray>({
        array: ["foo", "bar", "one"],
      });
    });

    it("should generate an object with an array with the given size", () => {
      const generated = generateObjWithArray({ array: 2 });
      expect(generated).toMatchObject<WithArray>({
        array: ["one", "two"],
      });
    });

    it("should generate an object with a primitive Record", () => {
      const generated = generateObjWithStringToNumberRecord();
      expect(generated).toMatchObject<WithStringToNumberRecord>({
        record: {
          one: 1,
          two: 2,
          three: 3,
        },
      });
    });

    it("should generate an object with a primitive Record with the given overrides", () => {
      const generated = generateObjWithStringToNumberRecord({
        record: {
          foo: 111,
          bar: 222,
          baz: undefined,
        },
      });
      expect(generated).toMatchObject<WithStringToNumberRecord>({
        record: {
          foo: 111,
          bar: 222,
          baz: 1,
        },
      });
    });

    it("should generate an object with an object Record with the given overrides", () => {
      const generated = generateObjWithNumberToObjectRecord({
        record: {
          1: undefined,
          2: {
            primitive: undefined,
            optionalPrimitive: 123,
          },
        },
      });
      expect(generated).toMatchObject<WithNumberToObjectRecord>({
        record: {
          1: {
            primitive: 111,
            nullablePrimitive: 222,
          },
          2: {
            primitive: 111,
            nullablePrimitive: 222,
            optionalPrimitive: 123,
          },
        },
      });
    });

    it("should generate a Record with the given size", () => {
      const generated = generateObjWithStringToNumberRecord({ record: 2 });
      expect(generated).toMatchObject<WithStringToNumberRecord>({
        record: {
          one: 1,
          two: 2,
        },
      });
    });
  });

  describe("Type inferring", () => {
    // This section is testing that we can create a template with the expected types of generators
    // testing that the complex types for inferring what kind of generator is allowed works with various types
    interface BasicObject {
      key1: string;
      key2?: string;
    }

    interface ExtendedObject extends BasicObject {
      key3: string;
    }

    enum NumericEnum {
      ONE,
      TWO,
      THREE,
    }

    enum StringEnum {
      ONE = "one",
      TWO = "two",
      THREE = "three",
    }

    type OmitType = Omit<BasicObject, "key2">;
    type PartialType = Partial<BasicObject>;
    type RequiredType = Required<BasicObject>;
    type RecordType = Record<string, BasicObject>;
    type UnionType = string | number;
    type IntersectionType = BasicObject & {
      key3: string;
    };
    type LiteralType = "HelloWorld";
    type LiteralUnionType = "one" | "two" | "three";
    type NullableType = string | null;
    type MappedType<T> = {
      [key in keyof T]: boolean;
    };
    type TemplateLiteralType = `number_${LiteralUnionType}`;
    type TupleType = [string, number];
    type ReadonlyTupleType = readonly [string, number];

    interface AggregateObject {
      basicObject: BasicObject;
      basicObject2: BasicObject;
      optionalBasicObject1?: BasicObject;
      optionalBasicObject2?: BasicObject;
      extendedObject: ExtendedObject;
      numericEnum: NumericEnum;
      stringEnum: StringEnum;
      optionalEnum1?: NumericEnum;
      optionalEnum2?: NumericEnum;
      omitType: OmitType;
      partialType: PartialType;
      requiredType: RequiredType;
      recordType: RecordType;
      unionType: UnionType;
      unionType2: UnionType;
      intersectionType: IntersectionType;
      literalType: LiteralType;
      literalUnionType: LiteralUnionType;
      nullableType: NullableType;
      mappedType: MappedType<BasicObject>;
      templateLiteralType: TemplateLiteralType;
      tupleType: TupleType;
      readonlyTupleType: ReadonlyTupleType;
    }

    const generateBasicObject: GeneratorFn<BasicObject> = createObjGenerator<BasicObject>({
      key1: (): string => "key1",
      key2: GeneratorMode.OPTIONAL,
    });

    const generateExtendedObject: GeneratorFn<ExtendedObject> = createObjGenerator<ExtendedObject>({
      key1: (): string => "key1",
      key2: (): string => "key2",
      key3: (): string => "key3",
    });

    const generateOmitType: GeneratorFn<OmitType> = createObjGenerator<OmitType>({
      key1: (): string => "key1",
    });

    const generatePartialType: GeneratorFn<PartialType> = createObjGenerator<PartialType>({
      key1: GeneratorMode.OPTIONAL,
      key2: GeneratorMode.OPTIONAL,
    });

    const generateRequiredType: GeneratorFn<RequiredType> = createObjGenerator<RequiredType>({
      key1: (): string => "key1",
      key2: (): string => "key2",
    });

    const generateRecordType: GeneratorFn<RecordType> = createRecordGenerator<string, BasicObject>(() => "key1", generateBasicObject);

    const generateUnionType: GeneratorFn<UnionType> = (): string => "abc";
    const generateUnionType2: GeneratorFn<UnionType> = (): UnionType => 123;

    const generateIntersectionType: GeneratorFn<IntersectionType> = createObjGenerator<IntersectionType>({
      key1: (): string => "key1",
      key2: (): string => "key2",
      key3: (): string => "key3",
    });

    const generateLiteralType: GeneratorFn<LiteralType> = () => "HelloWorld";
    const generateLiteralUnionType: GeneratorFn<LiteralUnionType> = () => "two";
    const generateNullableType: GeneratorFn<NullableType> = () => null;

    const generateMappedType: GeneratorFn<MappedType<BasicObject>> = createObjGenerator<MappedType<BasicObject>>({
      key1: () => true,
      key2: GeneratorMode.OPTIONAL,
    });

    const generateTemplateLiteralType: GeneratorFn<TemplateLiteralType> = () => "number_two";

    const generateTupleType: GeneratorFn<TupleType> = () => ["abc", 123];
    const generateReadonlyTupleType: GeneratorFn<ReadonlyTupleType> = () => ["abc", 123];

    const generateAggregateObject = createObjGenerator<AggregateObject>({
      basicObject: [GeneratorMode.FORCE, generateBasicObject],
      basicObject2: generateBasicObject,
      optionalBasicObject1: generateBasicObject,
      optionalBasicObject2: [GeneratorMode.OPTIONAL, generateBasicObject],
      extendedObject: generateExtendedObject,
      numericEnum: createEnumGenerator(NumericEnum),
      stringEnum: createEnumGenerator(StringEnum),
      optionalEnum1: GeneratorMode.OPTIONAL,
      optionalEnum2: createEnumGenerator(NumericEnum),
      omitType: generateOmitType,
      partialType: generatePartialType,
      requiredType: generateRequiredType,
      recordType: generateRecordType,
      unionType: generateUnionType,
      unionType2: generateUnionType2,
      intersectionType: generateIntersectionType,
      literalType: generateLiteralType,
      literalUnionType: generateLiteralUnionType,
      nullableType: generateNullableType,
      mappedType: generateMappedType,
      templateLiteralType: generateTemplateLiteralType,
      tupleType: generateTupleType,
      readonlyTupleType: generateReadonlyTupleType,
    });

    describe("it should not fail to compile", () => {
      generateAggregateObject();
    });
  });
});
