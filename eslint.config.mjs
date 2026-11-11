import baseConfig from './packages/config/eslint/base.js';

export default [
  ...baseConfig,
  {
    ignores: [
      '**/dist/**',
      '**/.next/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/*.tsbuildinfo',
      'docs/**',
      'tooling/run.js',
    ],
  },
];
