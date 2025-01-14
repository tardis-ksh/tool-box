import { purgePathCache } from '@tardis-ksh/tencent/cdn';
import * as process from 'node:process';

async function test() {
  try {
    const result = await purgePathCache({
      secretId: process.env.TENCENT_SECRET_ID!,
      secretKey: process.env.TENCENT_SECRET_KEY!,
      paths: ['https://test.ksh7.com/'],
      flushType: 'delete',
    });

    console.log(result, 'result');
  } catch (error) {
    console.log(error);
  }
}

test();
