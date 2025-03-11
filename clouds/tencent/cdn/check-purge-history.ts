import type { DescribePurgeTasksRequest } from 'tencentcloud-sdk-nodejs-cdn/src/services/cdn/v20180606/cdn_models.ts';

import { handleCdnRequest } from '@/utils/cdn.js';

export type IDescribePurgeTaskParams = DescribePurgeTasksRequest;

const DescribePurgeTasks = (
  credentials: Tencent.Credentials,
  originParams: IDescribePurgeTaskParams,
) => {
  return handleCdnRequest<'DescribePurgeTasks'>(
    'DescribePurgeTasks',
    credentials,
    originParams,
  );
};

export interface IDescribePurgeTasksStatusOptions {
  TaskId: IDescribePurgeTaskParams['TaskId'];
  maxCount?: number;
  waitTime?: number;
}

export const DefaultLoopOptions = {
  maxCount: 10,
  waitTime: 30000,
};

export async function describePurgeTasksStatusByTaskId(
  credentials: Tencent.Credentials,
  originOptions: IDescribePurgeTasksStatusOptions,
  originParams: Omit<DescribePurgeTasksRequest, 'taskId'>,
) {
  console.log(
    'describePurgeTasksStatusByTaskId params: ',
    originOptions,
    originParams,
  );

  if (!originOptions || !originOptions.TaskId) {
    console.log('wrong options: ', originOptions);
    return false;
  }

  const options = {
    ...DefaultLoopOptions,
    ...originOptions,
  };

  const { TaskId, maxCount, waitTime } = options;

  const params = {
    ...originParams,
    TaskId,
  };

  let count = 0;
  const startTime = performance.now();

  while (true) {
    if (count >= maxCount) {
      console.log('max count reached: ', maxCount);
      return false;
    }

    count += 1;
    console.log('checking purge task status: ', TaskId, 'count: ', count);

    const result = await DescribePurgeTasks(credentials, params);
    const { success, data } = result;

    if (!success || !data) {
      console.log('Wrong result: ', result);
      return false;
    }
    const { TotalCount, PurgeLogs } = data;
    if (!TotalCount) {
      console.log('Wrong TotalCount: ', TotalCount);
      return false;
    }
    const currentPurgeTask = PurgeLogs?.find(
      (task) => task.TaskId === params.TaskId,
    );
    if (!currentPurgeTask) {
      console.log('task not found: ', TaskId);
      return false;
    }
    const { Status } = currentPurgeTask;

    if (Status === 'done') {
      const endTime = performance.now() - startTime;
      console.log(
        'task done: ',
        TaskId,
        'use time: ',
        endTime,
        'ms',
        endTime / 1000 / 60,
        'min',
      );
      return true;
    }

    console.log('task not done: ', TaskId, 'status: ', Status);

    await new Promise((resolve) => {
      setTimeout(resolve, waitTime);
    });
  }
}

export default DescribePurgeTasks;
