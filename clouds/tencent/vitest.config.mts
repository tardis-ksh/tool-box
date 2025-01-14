import path from 'node:path';

import { defineProject } from 'vitest/config';

export default defineProject({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
