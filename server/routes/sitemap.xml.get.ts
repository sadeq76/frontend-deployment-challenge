import { fetchProducts } from '../utils/fake-store'
import { buildSitemapXml } from '../utils/sitemap'

export default defineEventHandler(async (event) => {
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  const products = await fetchProducts()
  return buildSitemapXml(useRuntimeConfig().public.siteUrl, products)
})
