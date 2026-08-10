import { describe, expect, it } from 'vitest'
import { isPageComponentFile, removePageComponentRoutes, type GeneratedPageRoute } from '../../src/lib/page-routes'

describe('page component route filtering', () => {
  it('recognizes both Windows and POSIX page component paths', () => {
    expect(isPageComponentFile('C:\\workspace\\src\\pages\\product\\components\\filter-panel.vue')).toBe(true)
    expect(isPageComponentFile('/workspace/src/pages/product/components/filter-panel.vue')).toBe(true)
    expect(isPageComponentFile('/workspace/src/pages/product/index.vue')).toBe(false)
  })

  it('removes page-local components while retaining public page routes', () => {
    const pages: GeneratedPageRoute[] = [
      { file: '/workspace/src/pages/product/index.vue' },
      { file: '/workspace/src/pages/product/components/filter-panel.vue' },
      {
        file: '/workspace/src/pages/catalog.vue',
        children: [
          { file: '/workspace/src/pages/catalog/components/catalog-toolbar.vue' },
          { file: '/workspace/src/pages/catalog/[id].vue' }
        ]
      }
    ]

    removePageComponentRoutes(pages)

    expect(pages).toEqual([
      { file: '/workspace/src/pages/product/index.vue' },
      {
        file: '/workspace/src/pages/catalog.vue',
        children: [{ file: '/workspace/src/pages/catalog/[id].vue' }]
      }
    ])
  })
})
