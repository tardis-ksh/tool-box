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

import { describePurgeTasks, IDescribePurgeTaskParams } from '@/cdn/index.js';
import { creatCdnClient, handleCdnRequest } from '@/utils/cdn.js';
import { MockCredentials } from '@/constants/test.js';

const params: IDescribePurgeTaskParams = {
  PurgeType: 'path',
  Area: 'global',
  TaskId: 'mockTaskId',
};

describe('check purge history', async () => {
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
        PurgeLogs: [
          {
            TaskId: params.TaskId,
            PurgeType: params.PurgeType,
            FlushType: 'mockFlushType',
            CreateTime: Date.now(),
            Url: 'mockUrl',
          },
        ],
        TotalCount: 1,
        RequestId: 'RequestId',
      },
      success: true,
    };
    mockHandleCdnRequest.mockResolvedValueOnce(mockResponse);

    const result = await describePurgeTasks(MockCredentials, params);

    expect(result).toEqual(mockResponse);

    expect(mockHandleCdnRequest).toHaveBeenCalledWith(
      'DescribePurgeTasks',
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
      await describePurgeTasks(MockCredentials, params);
    } catch {
      /* empty */
    }
    expect(process.exit).toHaveBeenCalled();
  });
});
