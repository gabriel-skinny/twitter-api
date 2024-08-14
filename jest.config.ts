import { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json"

const config: Config = {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: "<rootDir>/"
    }),
    "testRegex": ".*\\.spec\\.ts$",
    rootDir: './',
    modulePaths: ['<rootDir>'],
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }

export default config;