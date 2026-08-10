import { findSimilarRoute, knownRoutes } from '~/lib/fuzzy-route'

export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/' || to.path === '/product' || /^\/product\/\d+$/.test(to.path)) return
  const productPath = to.path.replace(/^\/products(?=\/|$)/, '/product')
  if (productPath !== to.path && (productPath === '/product' || /^\/product\/\d+$/.test(productPath))) {
    return navigateTo({ path: productPath, query: to.query }, { redirectCode: 301 })
  }
  const match = findSimilarRoute(to.path, knownRoutes)
  if (match && match.score >= 0.82) return navigateTo({ path: match.path, query: to.query }, { redirectCode: 301 })
})
