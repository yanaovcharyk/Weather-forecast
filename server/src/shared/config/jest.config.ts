import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../../',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@weather/(.*)$': '<rootDir>/modules/weather/$1',
    '^@auth/(.*)$': '<rootDir>/modules/auth/$1',
    '^@users/(.*)$': '<rootDir>/modules/users/$1',
    '^@logger/(.*)$': '<rootDir>/modules/logger/$1',
    '^@cities/(.*)$': '<rootDir>/modules/cities/$1',
    '^@controllers/(.*)$': '<rootDir>/modules/controllers/$1',
    '^@database/(.*)$': '<rootDir>/modules/database/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^@test/(.*)$': '<rootDir>/modules/test/$1',
  },

  clearMocks: true,
  testTimeout: 30000,

  coveragePathIgnorePatterns: [
  '/node_modules/',
  '/modules/test/',
  '/dto/',
  '/entities/',
  '/shared/config/',
  '\\.config\\.ts$',
  '/migrations/',
  '/resolvers/',
  '/decorators/',
  '/index\\.ts$',
],
};

export default config;
