import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Architecture guard-rails.
 *
 * The folder layout mirrors the layers from "Modularizing React Applications
 * with Established UI Patterns" (martinfowler.com). These rules make the
 * layering *enforced* instead of aspirational:
 *
 *   components/  humble views      → props only; no store, no network, no hooks
 *   hooks/       view-model hooks  → state + side effects, compose model & api
 *   state/       Redux slices      → serializable UI/application state
 *   api/         gateway (ACL)     → network + DTO validation, no React
 *   model/       domain            → plain TypeScript, no React / Redux / MUI
 */
const VIEW_LIBS = ['react', 'react-dom', 'react-dom/*', 'react-redux', 'react-router', '@mui/*', '@emotion/*'];

const restrict = (...patterns) => ({
  'no-restricted-imports': ['error', { patterns }],
});

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'public/mockServiceWorker.js'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // Domain layer: framework-free TypeScript
  {
    files: ['src/shared/domain/**/*.ts', 'src/features/*/model/**/*.ts'],
    rules: restrict(
      {
        group: [...VIEW_LIBS, '@reduxjs/*', 'zod'],
        message: 'Domain models must be framework-free so they can be reused (other views, Node, tests).',
      },
      {
        group: ['**/api', '**/api/**', '**/state', '**/state/**', '**/hooks', '**/hooks/**', '**/components', '**/components/**', '@/app/*', '@/features/*'],
        message: 'The domain layer must not depend on outer layers or on other features.',
      },
    ),
  },

  // Gateway / anti-corruption layer: no React
  {
    files: ['src/features/*/api/**/*.ts'],
    rules: restrict(
      { group: VIEW_LIBS, message: 'The gateway layer must not depend on the view library.' },
      {
        group: ['**/hooks', '**/hooks/**', '**/components', '**/components/**', '**/state', '**/state/**'],
        message: 'The gateway only knows about the network and the domain model.',
      },
    ),
  },

  // Humble views: everything arrives via props
  {
    files: ['src/features/*/components/**/*.tsx', 'src/shared/ui/**/*.tsx'],
    ignores: ['**/*.test.tsx'],
    rules: restrict({
      group: ['react-redux', '@reduxjs/*', '**/api', '**/api/**', '**/state', '**/state/**', '**/hooks', '**/hooks/**', '@/app/*'],
      message: 'Humble view components receive data and callbacks via props. Put state in a hook.',
    }),
  },

  // Composition roots consume features only through their public API
  {
    files: ['src/pages/**/*.tsx', 'src/app/**/*.{ts,tsx}'],
    ignores: ['**/*.test.tsx'],
    rules: restrict({
      group: ['@/features/*/*'],
      message: 'Import a feature through its public index (e.g. "@/features/cart"), not its internals.',
    }),
  },
);
