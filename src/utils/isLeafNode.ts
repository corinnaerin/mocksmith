export function isLeafNode(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  if (value instanceof Date) {
    return true;
  }
  switch (typeof value) {
    case "string":
    case "number":
    case "bigint":
    case "boolean":
    case "symbol":
      return true;
    default:
      return false;
  }
}
