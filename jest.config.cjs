/** @type {import('jest').Config} */

const baseDir = '<rootDir>/src/app/doubles';
const baseTestDir = '<rootDir>/src/test/doubles';

module.exports = {
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    `${baseDir}/**/*.ts`
  ],
  testMatch: [
    `${baseTestDir}/**/*.ts`
  ]
};