const path = require('node:path')
const {
  analyzeCommits,
  generateNotes,
  success,
  fail,
  tagFormat,
} = require('semantic-release-monorepo')

const repoRoot = __dirname

module.exports = (packageDir) => ({
  branches: ['master'],
  tagFormat,
  analyzeCommits,
  generateNotes,
  success,
  fail,
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    '@semantic-release/github',
    [
      '@semantic-release/git',
      {
        assets: ['package.json', path.relative(packageDir, path.join(repoRoot, 'pnpm-lock.yaml'))],
        message: 'chore(release): publish ${nextRelease.gitTag}\n\n${nextRelease.notes}',
      },
    ],
  ],
})
