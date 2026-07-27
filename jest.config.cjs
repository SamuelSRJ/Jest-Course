/** @type {import('jest').Config} */

const baseDir = '<rootDir>/src/app/passChecker';
const baseTestDir = '<rootDir>/src/test/passChecker';

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