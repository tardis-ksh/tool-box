# Tencent Tools

[![codecov](https://codecov.io/gh/tardis-ksh/tool-box/graph/badge.svg?token=ETUGKV3NKL)](https://codecov.io/gh/tardis-ksh/tool-box) [![tests](https://github.com/tardis-ksh/tool-box/actions/workflows/test.yml/badge.svg)](https://github.com/tardis-ksh/tool-box/actions/workflows/test.yml)

## CDN

### Purge-Paths-Cache

```js
const { purgePathCache } = require('@tardis-ksh/tencent/cdn');

// or

import { purgePathCache } from '@tardis-ksh/tencent/cdn';

purgePathCache({
  secretId: process.env.TENCENT_SECRET_ID,
  secretKey: process.env.TENCENT_SECRET_KEY,
  paths: ['https://api.ksh7.com/'],
  flushType: 'delete',
});
```
