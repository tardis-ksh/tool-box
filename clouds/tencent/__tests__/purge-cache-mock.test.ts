import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import type { PurgePathCacheResponse } from 'tencentcloud-sdk-nodejs-cdn/src/services/cdn/v20180606/cdn_models.js';

import { type IPurgeCache, purgePathCache } from '@/cdn/index.js';

const getMockParams = (): IPurgeCache => {
  return {
    flushType: 'flush',
    paths: ['https://test.ksh7.com'],
    secretId: process.env.TENCENT_SECRET_ID || 'secretId',
    secretKey: process.env.TENCENT_SECRET_KEY || 'secretKey',
    // secretId: 'secretId',
    // secretKey: 'secretKey',
  };
};

// for directory
describe('purge path cache', async () => {
  // 存储原始的 process.exit
  const originalProcessExit = process.exit;

  describe('test with mock', () => {
    const { mockCdnClient } = vi.hoisted(() => {
      return {
        mockCdnClient: {
          PurgePathCache: vi.fn(),
        },
      };
    });

    beforeAll(() => {
      vi.mock(import('tencentcloud-sdk-nodejs-cdn'), async () => {
        console.log('test with mock - beforeAll');
        // const actual = await importOriginal();
        return {
          default: {
            // ...actual.default,
            cdn: {
              v20180606: {
                Client: vi.fn(() => mockCdnClient as never),
                Models: {},
              },
            },
          },
        };
      });
    });

    beforeEach(() => {
      // 在每个测试前重置所有模拟
      vi.clearAllMocks();

      // 模拟 process.exit
      process.exit = vi.fn() as never;
    });

    afterEach(() => {
      // 测试后恢复原始的 process.exit
      process.exit = originalProcessExit;
    });

    afterAll(() => {
      vi.doUnmock('tencentcloud-sdk-nodejs-cdn');
      vi.restoreAllMocks();
      vi.resetModules();
      vi.clearAllMocks();
    });

    test('check params input & output', async () => {
      // 测试数据
      const mockResponse: PurgePathCacheResponse = {
        TaskId: 'taskId',
        RequestId: 'RequestId',
      };
      const params = getMockParams();

      const PurgePathCacheSpy = vi.spyOn(mockCdnClient, 'PurgePathCache');
      const creatCdnClientSpy = vi.spyOn(
        await import('@/utils/cdn.js'),
        'creatCdnClient',
      );

      mockCdnClient.PurgePathCache.mockResolvedValueOnce(mockResponse);
      const result = await purgePathCache(params);

      // 验证参数
      expect(creatCdnClientSpy).toHaveBeenCalledWith({
        secretId: params.secretId,
        secretKey: params.secretKey,
      });

      // 验证对 CDN 的输入的参数
      expect(PurgePathCacheSpy).toHaveBeenCalledWith({
        Paths: params.paths,
        FlushType: params.flushType,
        UrlEncode: params.urlEncode || false,
        Area: params.area,
      });

      // 验证结果
      expect(result).toEqual({
        data: mockResponse,
        success: true,
      });
    });

    test('check error exit', async () => {
      const mockError = new Error('API error');
      const params = getMockParams();
      mockCdnClient.PurgePathCache.mockRejectedValueOnce(mockError);

      try {
        await purgePathCache(params);
      } catch {
        /* empty */
      }

      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('purge path cache real', () => {
    beforeEach(() => {
      process.exit = vi.fn(() => {
        throw new Error('API Error');
      }) as never;
    });

    afterEach(() => {
      process.exit = originalProcessExit;
    });

    test('success or fail', async () => {
      try {
        const params = getMockParams();
        const { purgePathCache: originPurePathCache } = await import(
          '@/cdn/index.js'
        );
        const result = await originPurePathCache(params);

        expect.soft(result).toHaveProperty('success', true);
        expect.soft(result).toHaveProperty(['data', 'TaskId']);
        expect.soft(result).toHaveProperty(['data', 'RequestId']);
        console.log('success assert');
      } catch {
        console.log('error fail assert');
        expect(process.exit).toHaveBeenCalledWith(1);
      }
    });
  });
});
