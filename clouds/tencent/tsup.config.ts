import { defineConfig, type Options } from 'tsup';
import path from 'node:path';

import { nodeConfig } from '@tardis-ksh/tsup-config';

const commonConfig: Partial<Options> = {
  ...nodeConfig,
  format: ['esm'],
  dts: true,
  minify: false,
};

const tsupConfig: Options[] = [
  {
    ...commonConfig,
    entry: ['cdn/index.ts', 'log/index.ts'],
    esbuildOptions: (options) => {
      options.alias = {
        '@': path.resolve(process.cwd(), './'),
      };
    },
  },
];

export default defineConfig(tsupConfig);
