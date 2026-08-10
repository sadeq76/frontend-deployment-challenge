export interface RouteMatch {
  path: string
  score: number
}

function distance(left: string, right: string): number {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex++) {
    const current = [leftIndex]
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex++) {
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + Number(left[leftIndex - 1] !== right[rightIndex - 1])
      )
    }
    previous.splice(0, previous.length, ...current)
  }
  return previous[right.length]
}

/** Scores path segments without adding a runtime package dependency. */
export function findSimilarRoute(path: string, candidates: readonly string[]): RouteMatch | null {
  const normalized = `/${path}`.replace(/\/{2,}/g, '/').replace(/\/$/, '').toLowerCase() || '/'
  const matches = candidates.map((candidate) => {
    const target = candidate.toLowerCase()
    const maxLength = Math.max(normalized.length, target.length)
    return { path: candidate, score: maxLength ? 1 - distance(normalized, target) / maxLength : 1 }
  }).sort((first, second) => second.score - first.score)
  return matches[0] ?? null
}

export const knownRoutes = ['/product'] as const
