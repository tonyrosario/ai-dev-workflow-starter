/** @type {import('@stryker-mutator/core').PartialStrykerOptions} */
const config = {
  testRunner: 'vitest',
  vitest: { configFile: 'vitest.config.ts' },
  mutate: [
    'src/**/*.ts',
    '!src/**/__tests__/**/*.ts',
    '!src/**/index.ts',
    '!src/**/*.d.ts',
    'scripts/**/*.js',
    '!scripts/**/__tests__/**/*.js',
  ],
  coverageAnalysis: 'perTest',
  reporters: ['html', 'json', 'clear-text'],
  htmlReporter: { fileName: 'reports/mutation/index.html' },
  jsonReporter: { fileName: 'reports/mutation/mutation.json' },
  thresholds: { high: 80, low: 60, break: 60 },
  concurrency: 2,
  // Baseline validated (100% score). Incremental mode enabled for faster subsequent runs.
  incremental: true,
  incrementalFile: 'reports/stryker-incremental.json',
  disableTypeChecks: true,
  ignoreStatic: true,
  mutator: {
    excludedMutations: ['StringLiteral'],
  },
};
export default config;
