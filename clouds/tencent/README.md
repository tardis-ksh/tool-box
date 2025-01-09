# Tencent Tools

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
