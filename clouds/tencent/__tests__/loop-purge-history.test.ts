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

import {
  describePurgeTasksStatusByTaskId,
  IDescribePurgeTaskParams,
  IDescribePurgeTasksStatusOptions,
} from '@/cdn/index.js';
import { handleCdnRequest } from '@/utils/cdn.js';
import { MockCredentials } from '@/constants/test.js';
import type { PurgeTask } from 'tencentcloud-sdk-nodejs-cdn/src/services/cdn/v20180606/cdn_models.js';

const params: Omit<IDescribePurgeTaskParams, 'TaskId'> = {
  PurgeType: 'path',
  Area: 'global',
};
const options: IDescribePurgeTasksStatusOptions = {
  TaskId: 'mockTaskId',
};

const mockResponse = (PurgeLogs?: Partial<PurgeTask>) => {
  return {
    data: {
      PurgeLogs: [
        {
          TaskId: options.TaskId,
          PurgeType: params.PurgeType,
          FlushType: 'mockFlushType',
          CreateTime: Date.now(),
          Url: 'mockUrl',
          Status: 'done',
          ...PurgeLogs,
        },
      ],
      TotalCount: 1,
      RequestId: 'RequestId',
    },
    success: true,
  };
};

describe('loop purge history', async () => {
  const originalProcessExit = process.exit;
  const mockHandleCdnRequest = handleCdnRequest as Mock;

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

  test('should return false when options is missing TaskId', async () => {
    const result = await describePurgeTasksStatusByTaskId(
      MockCredentials,
      {
        ...options,
        TaskId: undefined,
      },
      params,
    );

    expect(result).toBe(false);
  });

  test('should return false when max count is reached', async () => {
    const result = await describePurgeTasksStatusByTaskId(
      MockCredentials,
      {
        ...options,
        maxCount: 0,
      },
      params,
    );

    expect(result).toBe(false);
  });

  test('should return false when TaskId miss in remote', async () => {
    // const mockHandleCdnRequest = handleCdnRequest as Mock;
    const instance = describePurgeTasksStatusByTaskId.bind(
      undefined,
      MockCredentials,
      options,
      params,
    );

    // mock request fail
    mockHandleCdnRequest.mockResolvedValueOnce({
      success: false,
    });

    const result = await instance();

    expect(result).toBe(false);

    // mock request success but no data
    mockHandleCdnRequest.mockResolvedValueOnce({
      success: true,
      data: {
        PurgeLogs: [],
        TotalCount: 0,
        RequestId: 'RequestId',
      },
    });

    const resultWithEmptyLogs = await instance();

    expect(resultWithEmptyLogs).toBe(false);

    // mock request success but no correct data
    const response = mockResponse({
      TaskId: 'new-mockTaskId',
    });
    mockHandleCdnRequest.mockResolvedValueOnce(response);

    const resultWithDifferentTaskId = await instance();
    expect(resultWithDifferentTaskId).toBe(false);
  });

  test('should return true when get status done', async () => {
    // const mockHandleCdnRequest = handleCdnRequest as Mock;
    mockHandleCdnRequest.mockResolvedValueOnce(
      mockResponse({ Status: 'process' }),
    );
    mockHandleCdnRequest.mockResolvedValueOnce(mockResponse());

    const result = await describePurgeTasksStatusByTaskId(
      MockCredentials,
      {
        ...options,
        maxCount: 2,
        waitTime: 20,
      },
      params,
    );

    expect(result).toBe(true);
  });
});
