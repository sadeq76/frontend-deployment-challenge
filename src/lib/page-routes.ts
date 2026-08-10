export interface GeneratedPageRoute {
  file?: string
  children?: GeneratedPageRoute[]
}

const pageComponentPattern = /(?:^|[\\/])pages[\\/](?:.*[\\/])?components[\\/]/

export function isPageComponentFile(file: string | undefined): boolean {
  return Boolean(file && pageComponentPattern.test(file))
}

/** Removes implementation-only page components from Nuxt's file-based routes. */
export function removePageComponentRoutes<T extends GeneratedPageRoute>(pages: T[]): void {
  for (let index = pages.length - 1; index >= 0; index--) {
    const route = pages[index]
    if (isPageComponentFile(route.file)) pages.splice(index, 1)
    else if (route.children) removePageComponentRoutes(route.children)
  }
}
