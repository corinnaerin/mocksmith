# WIP

Coming soon!

# 🛠️ Mocksmith

### *Template-driven, deeply composable test data generation for TypeScript*

Mocksmith helps you generate realistic test data **without verbose mocks, boilerplate objects, or copy-pasted fixtures**.
Define a **template** describing how each field should be generated, provide **optional overrides**, and Mocksmith produces fully typed, deeply nested objects—while keeping tests readable and focused on what actually matters.

Mocksmith works perfectly with any random data generator (like `chance`, `faker`, or `@faker-js/faker`) for individual values.

---

## 🚀 Why Mocksmith?

Traditional mocks tend to drift, grow unwieldy, or hide what your test actually cares about. Mocksmith solves that by:

* 🧱 **Letting you define object “blueprints” once**
* 🔄 **Allowing nested overrides at any depth**
* 🧪 **Keeping tests readable and intentional**
* ✨ **Generating only what you need, no more, no less**
* 🔌 **Pairing easily with any random-value generator**
* ⚠️ **Avoiding shared mock state between tests**

In other words:
**Less mock maintenance. More test clarity.**

---

## 📦 Installation

```bash
npm install mocksmith
```

or

```bash
yarn add mocksmith
```

---

## 🧰 Example: Creating a Generator

```ts
import { createObjGenerator, createArrayGenerator, GeneratorMode } from "mocksmith";
import chance from "chance";

interface MyObject {
  numberKey: number;
  booleanKey?: boolean;
  dateKey: Date;
  enumKey: MyEnum;
  optionalNestedObjectKey?: MyNestedObject;
  nestedObjectArray: MyNestedObject[];
  nestedPrimitiveArray: string[];
}

const generateMyEnum = createEnumGenerator(MyEnum);

const generateMyObject = createObjGenerator({
  numberKey: () => chance().natural({ max: 100 }),
  booleanKey: GeneratorMode.OPTIONAL,
  dateKey: [GeneratorMode.FORCE, () => chance().date()],
  enumKey: () => generateMyEnum(),

  optionalNestedObjectKey: [
    GeneratorMode.OPTIONAL,
    (overrides) => generateMyNestedObject(overrides),
  ],

  nestedObjectArray: createArrayGenerator(generateMyNestedObject, 10),
  nestedPrimitiveArray: createArrayGenerator(() => chance().guid()),
});
```

---

## 🧪 Example: Generating an Object

```ts
const myObject: MyObject = generateMyObject();
```

This creates an object with the shape defined by your template—generating only what's required.

---

## 🎯 Example: Using Overrides

```ts
const myObject = generateMyObject({
  booleanKey: true,
  dateKey: new Date(),
  optionalNestedObjectKey: { nestedKey1: "value" },
  nestedObjectArray: [
    { nestedKey1: "override" },
    {},
    undefined,
  ],
  nestedPrimitiveArray: 5, // Shortcut for "generate five of these"
});
```

Overrides can be nested at any depth. Arrays, maps, sets, and records support override-based sizing.

---

## 🧪 Using Mocksmith in Unit Tests

Without Mocksmith, tests often contain sprawling mock objects:

* giant fixtures that get reused everywhere
* unclear which fields matter to the test
* brittle mocks that break unrelated tests
* lots of copy/pasting

With Mocksmith:

```ts
describe("getDisplayName", () => {
  it("returns first and last name when defined", () => {
    const user = generateUser({
      firstName: "Bilbo",
      lastName: "Baggins",
    });

    expect(getDisplayName(user)).toBe("Bilbo Baggins");
  });

  it("falls back to username", () => {
    const user = generateUser({
      firstName: undefined,
      lastName: undefined,
      userName: "bbaggins",
    });

    expect(getDisplayName(user)).toBe("bbaggins");
  });
});
```

### Benefits in practice:

* Tests only specify what they care about
* Everything else is safely generated
* No shared mocks → no spooky test failures
* Much clearer intent

---

## 🔧 Core Concepts

### **Templates**

Define how each field should be generated.

### **Generator Modes**

* `INCLUDE` – Use overrides if provided; otherwise generate
* `OPTIONAL` – Don’t generate unless included
* `FORCE` – Always generate, ignoring overrides

### **Overrides**

Pass an object (or nested objects) specifying exact values.

### **Nested Generators**

Generators can be composed to any depth.

---

## 🧩 Works great with…

* `chance`
* `@faker-js/faker`
* `randexp`
* your own custom generators

Mocksmith doesn’t dictate how to generate *values* — only the *structure*.

---

## 🤝 Contributing

PRs, issues, and suggestions are welcome! If you try Mocksmith in your codebase and have ideas for improvement, please share your experience.

---

## 📘 License

MIT
