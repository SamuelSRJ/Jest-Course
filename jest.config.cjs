/** @type {import('jest').Config} */

const baseDir = '<rootDir>/src/app/server_app/';
const baseTestDir = '<rootDir>/src/test/server_app2/';

module.exports = {
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    `${baseDir}/**/*.ts`
  ],
  testMatch: [
    `${baseTestDir}/**/*test.ts`
  ]
};