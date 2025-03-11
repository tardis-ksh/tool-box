import {
  purgePathCache,
  pushUrlsCache,
  describePurgeTasks,
  describePurgeTasksStatusByTaskId,
} from '@tardis-ksh/tencent/cdn';

const Secrets = {
  secretId: process.env.TENCENT_SECRET_ID!,
  secretKey: process.env.TENCENT_SECRET_KEY!,
};

async function test() {
  try {
    const result = await purgePathCache(Secrets, {
      Paths: ['https://test.ksh7.com/'],
      FlushType: 'delete',
    });

    console.log(result, 'result');
  } catch (error) {
    console.log(error);
  }
}

async function test1() {
  try {
    const result = await pushUrlsCache(
      {
        secretId: process.env.TENCENT_SECRET_ID!,
        secretKey: process.env.TENCENT_SECRET_KEY!,
      },
      {
        Urls: ['https://test.ksh7.com/'],
        Area: 'mainland',
      },
    );

    console.log(result, 'result');
  } catch (error) {
    console.log(error);
  }
}

async function testDescribePurgeTasks() {
  const res = await describePurgeTasks(
    {
      secretId: process.env.TENCENT_SECRET_ID!,
      secretKey: process.env.TENCENT_SECRET_KEY!,
    },
    {
      TaskId: '557154885984910935',
      PurgeType: 'path',
      Area: 'global',
    },
  );

  console.log(res);
  // fail：刷新失败
  // done：刷新成功
  // process：刷新中
  // TaskId: '557154885984910935',
  // Url: 'https://test.ksh7.com/',
  // Status: 'done',
  // PurgeType: 'path',
  // FlushType: 'delete',
  // CreateTime: '2025-03-10 23:16:30'

  console.log(res.data?.PurgeLogs);
}

async function testDescribeTasksByTaskId() {
  const task = await purgePathCache(Secrets, {
    Paths: ['https://test.ksh7.com/'],
    FlushType: 'delete',
  });

  console.log(task, 'task');

  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  const res = await describePurgeTasksStatusByTaskId(
    Secrets,
    {
      TaskId: task.data?.TaskId,
    },
    {
      PurgeType: 'path',
      Area: 'global',
    },
  );

  console.log(res);
}

// test();
// test1();
// testDescribePurgeTasks();
testDescribeTasksByTaskId();
