import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.tsx'],

  // Resolve @/ imports to project root
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    // mock style imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },

  // Transform TypeScript with ts-jest, JS with babel-jest if present
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/components/ui/',
    '/lib/types/',
  ],

  // Coverage
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      branches: 75,   // % of branches covered
      functions: 75,  // % of functions covered
      lines: 90,      // % of lines covered
      statements: 75, // % of statements covered
    },
  },
}

export default config