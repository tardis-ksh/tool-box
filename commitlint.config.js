module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignore: [
    (commit) => commit?.includes('Version Packages'),
    (commit) => commit.includes('release packages'),
  ],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
        'test'
      ],
    ],
    // 'subject-case': [2, 'always', 'sentence-case'],
  },
};
