import { purgePathCache, pushUrlsCache } from '@tardis-ksh/tencent/cdn';

async function test() {
  try {
    const result = await purgePathCache(
      {
        secretId: process.env.TENCENT_SECRET_ID!,
        secretKey: process.env.TENCENT_SECRET_KEY!,
      },
      {
        Paths: ['https://test.ksh7.com/'],
        FlushType: 'delete',
      },
    );

    console.log(result, 'result');
  } catch (error) {
    console.log(error);
  }
}

async function test1() {
  try {
    const result = await pushUrlsCache(
      {
        secretId: process.env.TENCENT_SECRET_ID!,
        secretKey: process.env.TENCENT_SECRET_KEY!,
      },
      {
        Urls: ['https://test.ksh7.com/'],
        Area: 'mainland',
      },
    );

    console.log(result, 'result');
  } catch (error) {
    console.log(error);
  }
}

test();
test1();
