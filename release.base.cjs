module.exports = {
  branches: ['master'],
  plugins: [
    '@semantic-release/npm',
    '@semantic-release/github',
    [
      '@semantic-release/git',
      {
        assets: ['package.json', '../../pnpm-lock.yaml'],
        message: 'chore(release): publish ${nextRelease.gitTag}\n\n${nextRelease.notes}',
      },
    ],
  ],
}
