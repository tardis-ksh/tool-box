import { merge } from 'lodash-es';

import type { PushUrlsCacheRequest } from 'tencentcloud-sdk-nodejs-cdn/src/services/cdn/v20180606/cdn_models.ts';

import { handleCdnRequest } from '@/utils/cdn.js';

export type IPushUrlsCache = PushUrlsCacheRequest;

export const DefaultParams: Partial<IPushUrlsCache> = {};

const pushUrlsCache = (
  credentials: Tencent.Credentials,
  originParams: IPushUrlsCache,
) => {
  const params = merge({}, DefaultParams, originParams);

  return handleCdnRequest<'PushUrlsCache'>(
    'PushUrlsCache',
    credentials,
    params,
  );
};

export default pushUrlsCache;
