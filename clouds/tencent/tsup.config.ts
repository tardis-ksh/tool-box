import { defineConfig, type Options } from 'tsup';
import path from 'node:path';
import fs from 'fs/promises';
import type { Plugin } from 'esbuild';

import { nodeConfig } from '@tardis-ksh/tsup-config';

const commonConfig: Partial<Options> = {
  ...nodeConfig,
  format: ['esm'],
  dts: true,
  minify: false,
  clean: false,
};

/**
 * DTS 在构建时若 clean 为 true，则会删除 dist 目录下的所有 .d.ts, 现需求是保留 typing 目录下的 .d.ts 文件
 * 又因为 onSuccess 在 DTS 前执行，所以需要 cp typing 文件只能关闭 clean，手动删除 dist 目录（关闭理论不影响线上构建结果，但本地会由于多变的选项导致可能的废弃文件）
 * 所以手动在 start 钩子中删除 dist 目录，达到清理的目的
 * todo：后续 tsup 的 DTS 逻辑更新后再做处理
 */
const removeDistPlugin: Plugin = {
  name: 'pre-build',
  setup(build) {
    build.onStart(async () => {
      console.log('manual removing dist files');
      await fs.rm(path.resolve(process.cwd(), './dist'), {
        recursive: true,
        force: true,
      });
    });
  },
};

const tsupConfig: Options[] = [
  {
    ...commonConfig,
    entry: ['cdn/index.ts', 'log/index.ts'],
    dts: {
      banner: '/// <reference path="../typings/index.d.ts" />',
    },
    esbuildOptions: (options) => {
      options.alias = {
        '@': path.resolve(process.cwd(), './'),
      };
    },
    esbuildPlugins: [removeDistPlugin],
    onSuccess: async () => {
      console.log('moving global dts files');

      // 源文件夹路径
      const sourceDir = path.resolve(process.cwd(), './typings');

      // 目标文件夹路径
      const targetDir = path.resolve(process.cwd(), './dist', 'typings');
      await fs.cp(sourceDir, targetDir, { recursive: true });
    },
  },
];

export default defineConfig(tsupConfig);
