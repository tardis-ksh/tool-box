import chalk from 'chalk';

import { creatCdnClient } from '@/utils/cdn.js';

interface IPurgeCache {
  secretId: string;
  secretKey: string;
  paths: string[];
  flushType: 'flush' | 'delete' | string;
  urlEncode?: boolean;
  area?: 'mainland' | 'overseas';
}

const DefaultParams: Partial<IPurgeCache> = {
  urlEncode: false,
  flushType: 'delete',
};

const purgePathCache = async (params: IPurgeCache) => {
  const { secretId, secretKey, paths, flushType, urlEncode, area } = {
    ...DefaultParams,
    ...params,
  };

  const cdnClient = creatCdnClient({ secretKey, secretId });

  const purgeConfig = {
    Paths: paths,
    FlushType: flushType,
    UrlEncode: urlEncode,
    Area: area,
  };

  console.log(chalk.yellow('input purgeConfig'), purgeConfig);

  try {
    const data = await cdnClient.PurgePathCache(purgeConfig);
    console.log(chalk.green('purge cache success'), data);
    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error(chalk.red('purge cache error'), error);
    process.exit(1);
  }
};

export default purgePathCache;
