// @ts-check
/** @type {import('eslint').ESLint.ConfigData} */
const eslintConfig = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'next',
    'turbo',
    'prettier',
  ],
  plugins: [
    // 'testing-library',
    'prettier',
    'simple-import-sort',
    'unused-imports',
  ],
  // extends: ["@sushiswap/eslint-config", "turbo", "prettier", "next"],
  // plugins: ["testing-library", "simple-import-sort", "unused-imports"],
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
    },
  },
  // ignorePatterns: [
  //   "**/dist/**",
  //   "**/.next/**",
  //   "**/node_modules/**",
  //   "**/.graphclient/**",
  //   "**/.mesh/**",
  //   "**/generated/**",
  //   "**/typechain/**",
  //   "**/coverage/**",
  //   "**/exports/**",
  //   "**/playwright-report/**",
  //   "**/__tests__/*.test.ts",
  //   "**/test/*.test.ts",
  // ],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'react/display-name': 'off',
    // 'testing-library/prefer-screen-queries': 'off',
    'turbo/no-undeclared-env-vars': 'off',
    'prefer-const': 'off',
    '@next/next/no-img-element': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react/jsx-no-target-blank': 'off',
  },
  // overrides: [
  //   // Only uses Testing Library lint rules in test files
  //   {
  //     files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  //     extends: ["plugin:testing-library/react"],
  //     rules: {
  //       "testing-library/prefer-screen-queries": "warn",
  //     },
  //   },
  // ],
}

module.exports = eslintConfig
