import {
  describe,
  test,
  beforeAll,
  expect,
  afterEach,
  vi,
  afterAll,
} from 'vitest';
import type { Mock } from '@vitest/spy';

import { pushUrlsCache, IPushUrlsCache } from '@/cdn/index.js';
import { DefaultParams } from '@/cdn/push-urls-cache.js';
import { creatCdnClient, handleCdnRequest } from '@/utils/cdn.js';
import { MockCredentials } from '@/constants/test.js';

const params: IPushUrlsCache = {
  ...DefaultParams,
  Urls: ['https://test.ksh7.com/'],
  Area: 'mainland',
  UrlEncode: true,
};

describe('push urls cache', async () => {
  const originalProcessExit = process.exit;

  beforeAll(() => {
    vi.mock('@/utils/cdn.js', { spy: true });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.doUnmock('@/utils/cdn.js');
    process.exit = originalProcessExit;
  });

  test('mock input & success output', async () => {
    const mockHandleCdnRequest = handleCdnRequest as Mock;
    const mockResponse = {
      data: {
        TaskId: 'TaskId',
        RequestId: 'RequestId',
      },
      success: true,
    };
    mockHandleCdnRequest.mockResolvedValueOnce(mockResponse);

    const result = await pushUrlsCache(MockCredentials, params);

    expect(result).toEqual(mockResponse);

    expect(mockHandleCdnRequest).toHaveBeenCalledWith(
      'PushUrlsCache',
      MockCredentials,
      params,
    );
  });

  test('mock error', async () => {
    process.exit = vi.fn() as any;

    const mockCdnClient = creatCdnClient as Mock;
    const mockError = new Error('API error');
    mockCdnClient.mockRejectedValueOnce(mockError);

    try {
      await pushUrlsCache(MockCredentials, params);
    } catch {
      /* empty */
    }
    expect(process.exit).toHaveBeenCalled();
  });
});
