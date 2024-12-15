// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/tests/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      // Add any ts-jest specific configurations here
      // For example:
      // diagnostics: true,
      // tsconfig: 'tsconfig.json',
    }],
  },
};
