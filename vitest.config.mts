import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    workspace: ['clouds/*'],
    globals: true,
    coverage: {
      exclude: [
        '**/**/dist/**',
        '**/**/__tests__/**',
        'clouds/test/**',
        'packages/eslint/**',
        'packages/tsup-config/**',
        'clouds/tencent/log/**',
        'clouds/tencent/utils/index.ts',
        '*.config.*',
        '*.d.ts',
        '**/*.d.ts',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
      ],
    },
  },
});
