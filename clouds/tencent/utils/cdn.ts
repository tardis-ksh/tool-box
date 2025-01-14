import tencentCloud from 'tencentcloud-sdk-nodejs-cdn';

import { Credentials } from '@/types/index.d.js';

export type CdnClientParams = {} & Credentials;

export const creatCdnClient = (params: CdnClientParams) => {
  const { secretId, secretKey } = params;

  const clientConfig = {
    credential: {
      secretId,
      secretKey,
    },
    profile: {
      httpProfile: {
        endpoint: 'cdn.tencentcloudapi.com',
      },
    },
  };

  // @ts-ignore
  const CdnClient = tencentCloud.cdn.v20180606.Client;
  return new CdnClient(clientConfig);
};
