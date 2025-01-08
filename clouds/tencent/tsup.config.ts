import { defineConfig, type Options } from 'tsup';

import { nodeConfig } from '@tardis-ksh/tsup-config';

const commonConfig: Partial<Options> = {
  ...nodeConfig,
  format: ['esm'],
  dts: true,
};

const tsupConfig: Options[] = [
  {
    ...commonConfig,
    entry: ['cdn/index.ts', 'utils/index.ts'],
  },
];

export default defineConfig(tsupConfig);
