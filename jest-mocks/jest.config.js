module.exports = {
  coverageReporters: ['lcov'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'json', 'js'],
  preset: 'ts-jest',
  rootDir: './',
  testEnvironment: 'node',
  testMatch: ['**/test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
