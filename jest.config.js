module.exports = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["./jestSetup.ts"],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 87,
      lines: 94,
      statements: 94,
    },
  },
  collectCoverageFrom: ["src/**/*.ts", "!src/index.ts", "!src/types/**/*.ts"],
  coverageReporters: ["json", "lcov", "text", "clover", "text-summary"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testMatch: ["**/*.tests.(ts|tsx)"],
  moduleFileExtensions: ["ts", "js", "json"],
  moduleDirectories: ["src", "node_modules"],
};
