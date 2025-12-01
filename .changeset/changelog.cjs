const createGitHubChangelog = require('@changesets/changelog-github')

const formatSummary = (summary) => {
  if (!summary) return ''
  const lines = summary.trim().split('\n')
  const [headline, ...rest] = lines
  const details = rest
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `  - ${line}`)
    .join('\n')
  return { headline: headline ?? '', details }
}

module.exports = (options) => {
  const github = createGitHubChangelog(options)
  const baseReleaseLine = github.getReleaseLine
  const baseDependencyReleaseLine = github.getDependencyReleaseLine

  return {
    async getReleaseLine(changeset, type) {
      const { headline, details } = formatSummary(changeset.summary)
      const packages = changeset.releases
        .map((release) => `\`${release.name}\` (${release.type})`)
        .join(', ')

      const metadata = await baseReleaseLine(changeset, type)
      const metaLine = metadata ? metadata.replace(/^-/u, '').trim() : ''

      return [
        `- ${packages || 'Packages'}: ${headline}`.trim(),
        details,
        metaLine ? `  ${metaLine}` : '',
      ]
        .filter(Boolean)
        .join('\n')
    },
    async getDependencyReleaseLine(changesets, dependenciesUpdated) {
      return baseDependencyReleaseLine(changesets, dependenciesUpdated)
    },
  }
}
