module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  roots: ['src'],
  transformIgnorePatterns: ['<rootDir>/node_modules/.*\\.js', '<rootDir>/build/.*\\.js'],
  testMatch: ['**/__test__/*\\.(ts|js|tsx|jsx)', '**/*\\.(spec|test|e2e-spec)\\.(ts|js|tsx|jsx)'],
  collectCoverageFrom: ['src/**/*.(ts|tsx)', '!dist/', '!**/node_modules', '!/coverage'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  coverageReporters: ['json', 'lcov', 'text', 'html'],
  globals: {
    'ts-jest': {
      // to run tests faster and with fewer js problems
      isolatedModules: true,
      tsConfig: {
        allowJs: true,
        checkJs: false,
        skipLibCheck: true,
      },
    },
  },
};
