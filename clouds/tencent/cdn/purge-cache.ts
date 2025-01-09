import { creatCdnClient } from '@/utils/cdn.js';

interface IPurgeCache {
  secretId: string;
  secretKey: string;
  paths: string[];
  flushType: 'flush' | 'delete';
  urlEncode?: boolean;
  area?: 'mainland' | 'overseas';
}

const DefaultParams: Partial<IPurgeCache> = {
  urlEncode: false,
  flushType: 'delete',
};

const purgePathCache = (params: IPurgeCache) => {
  const { secretId, secretKey, paths, flushType, urlEncode, area } = {
    ...DefaultParams,
    ...params,
  };

  const cdnClient = creatCdnClient({ secretKey, secretId });

  console.log(cdnClient, paths, flushType, urlEncode, area);
};

export default purgePathCache;
