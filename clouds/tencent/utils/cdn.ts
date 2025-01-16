import tencentCloud from 'tencentcloud-sdk-nodejs-cdn';
import chalk from 'chalk';
import type { Client } from 'tencentcloud-sdk-nodejs-cdn/src/services/cdn/v20180606/cdn_client.js';

export type CdnClientParams = Tencent.Credentials & {};

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

type ClientMethod = keyof {
  [key in keyof Client as Client[key] extends (...args: any[]) => Promise<any>
    ? key
    : never]: Client[key];
};
type ClientMethodParams<T extends ClientMethod> = Parameters<Client[T]>[0];
type ClientMethodReturn<T extends ClientMethod> = Awaited<
  ReturnType<Client[T]>
>;
type CdnRequestResult<T> =
  | {
      success: boolean;
      data?: T;
    }
  | never;

export async function handleCdnRequest<T extends ClientMethod>(
  clientMethodName: ClientMethod,
  credentials: Tencent.Credentials,
  params: ClientMethodParams<T>,
): Promise<CdnRequestResult<ClientMethodReturn<T>>> {
  try {
    const cdnClient = creatCdnClient(credentials);

    // 保持内部 this 指向 cdnClient 实例
    const method = cdnClient[clientMethodName].bind(cdnClient) as (
      params: ClientMethodParams<T>,
    ) => Promise<ReturnType<Client[T]>>;

    console.log(chalk.yellow(`input ${clientMethodName} params`), params);

    const result = await method(params);

    console.log(chalk.green(`${clientMethodName} cache success`));

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error(chalk.red(`${clientMethodName} cache error`), error);
    process.exit(1);
  }
}
