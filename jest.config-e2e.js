import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testEnvironment: "node",
  testRegex: ".e2e.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  moduleNameMapper: {
    "^@app/shared(|/.*)$": "<rootDir>../../../libs/shared/src/$1"
  }
};

export default config;