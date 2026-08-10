import { findSimilarRoute, type RouteMatch } from './fuzzy-route'

export interface RouteDefinition {
  readonly path: `/${string}`
  readonly labelKey: string
  readonly aliases?: readonly `/${string}`[]
  readonly acceptsNumericChild?: boolean
}

export type RouteSuggestion = RouteDefinition & RouteMatch

/**
 * The single source of truth for public, static application routes.
 *
 * Dynamic product detail URLs are derived through `productPath` so their
 * canonical path remains consistent in redirects and server-generated URLs.
 */
export const routeRegistry = [
  {
    path: '/product',
    labelKey: 'nav.products',
    aliases: ['/products'],
    acceptsNumericChild: true
  }
] as const satisfies readonly RouteDefinition[]

export const fuzzyRedirectThreshold = 0.82

export const knownRoutePaths = routeRegistry.map((route) => route.path)

export function productPath(id: string | number): `/product/${string | number}` {
  return `/product/${id}`
}

export function findRouteSuggestion(path: string): RouteSuggestion | null {
  const match = findSimilarRoute(path, knownRoutePaths)
  if (!match) return null

  const route = routeRegistry.find((candidate) => candidate.path === match.path)
  return route ? { ...route, score: match.score } : null
}

/** Returns the canonical destination for an alias or a close route typo. */
export function resolveRouteRedirect(path: string): string | null {
  const normalizedPath = normalizePath(path)
  const aliasRedirect = resolveAliasRedirect(normalizedPath)
  if (aliasRedirect) return aliasRedirect

  const suggestion = findRouteSuggestion(normalizedPath)
  return suggestion && suggestion.score >= fuzzyRedirectThreshold && suggestion.path !== normalizedPath
    ? suggestion.path
    : null
}

function resolveAliasRedirect(path: string): string | null {
  for (const route of routeRegistry) {
    for (const alias of route.aliases ?? []) {
      if (path === alias) return route.path

      const childId = path.slice(alias.length)
      if (route.acceptsNumericChild && path.startsWith(`${alias}/`) && /^\/\d+$/.test(childId)) {
        return productPath(childId.slice(1))
      }
    }
  }

  return null
}

function normalizePath(path: string): `/${string}` {
  const normalized = `/${path}`.replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/'
  return normalized as `/${string}`
}
