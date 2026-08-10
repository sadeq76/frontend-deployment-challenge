import { resolveRouteRedirect } from '~/lib/route-registry'

export default defineNuxtRouteMiddleware((to) => {
  const redirectPath = resolveRouteRedirect(to.path)
  if (redirectPath) return navigateTo({ path: redirectPath, query: to.query }, { redirectCode: 301 })
})
