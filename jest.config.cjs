/** @type {import('jest').Config} */

module.exports = {
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: false,
  collectCoverageFrom: [
    '<rootDir>/src/app/**/*.ts'
  ]
};