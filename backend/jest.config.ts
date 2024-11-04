import type {Config} from "jest";

const config: Config = {
  preset         : "ts-jest",
  testEnvironment: "node",
  clearMocks     : true,
  testMatch      : ["**/*/*.spec.ts"],
  testTimeout    : 10000,
};

export default config;
