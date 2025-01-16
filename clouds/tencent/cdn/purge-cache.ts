import { merge } from 'lodash-es';
import { PurgePathCacheRequest } from 'tencentcloud-sdk-nodejs-cdn/src/services/cdn/v20180606/cdn_models.js';

import { handleCdnRequest } from '@/utils/cdn.js';

export type IPurgeCache = PurgePathCacheRequest;

export const DefaultParams: Partial<IPurgeCache> = {
  UrlEncode: false,
  FlushType: 'delete',
};

const purgePathCache = (
  credentials: Tencent.Credentials,
  originParams: IPurgeCache,
) => {
  const params = merge({}, DefaultParams, originParams);
  return handleCdnRequest<'PurgePathCache'>(
    'PurgePathCache',
    credentials,
    params,
  );
};

export default purgePathCache;
