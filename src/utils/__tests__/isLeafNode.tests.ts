import { isLeafNode } from "../isLeafNode";

describe("isLeafNode", () => {
  it("should return true for null", () => {
    expect(isLeafNode(null)).toBeTrue();
  });

  it("should return true for undefined", () => {
    expect(isLeafNode(undefined)).toBeTrue();
  });

  it("should return true for a string", () => {
    expect(isLeafNode("foo")).toBeTrue();
  });

  it("should return true for a number", () => {
    expect(isLeafNode(111)).toBeTrue();
  });

  it("should return true for a bigint", () => {
    expect(isLeafNode(BigInt(111))).toBeTrue();
  });

  it("should return true for a boolean", () => {
    expect(isLeafNode(false)).toBeTrue();
  });

  it("should return true for a Symbol", () => {
    expect(isLeafNode(Symbol(""))).toBeTrue();
  });

  it("should return true for a date", () => {
    expect(isLeafNode(new Date())).toBeTrue();
  });

  it("should return false for a plain object", () => {
    expect(isLeafNode({})).toBeFalse();
  });

  it("should return false for an object", () => {
    expect(isLeafNode(new Map())).toBeFalse();
  });
});
