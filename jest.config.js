/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  testEnvironment: 'jsdom',
  collectCoverage: true,
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  // [...]
  preset: 'ts-jest/presets/default-esm', // or other ESM presets
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
    '^.+\\.js$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(intl-messageformat|@formatjs|estree-walker)/)',
  ],
  moduleNameMapper: {
    '^estree-walker$': '<rootDir>/node_modules/estree-walker/src/index.js',
    '^svelte/store$': '<rootDir>/test/__mocks__/svelte/store.js',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
