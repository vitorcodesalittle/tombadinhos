/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'node',
  globalSetup: "./setup-tests.ts",
  transform: {
    "(tsx|jsx|ts)": ["esbuild-jest-transform", {
      platform: 'node'
    }],
  },
  testPathIgnorePatterns: ['.*dist/.*', '.*build/.*']
};
