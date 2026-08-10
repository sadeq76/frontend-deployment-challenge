import { fetchProduct } from '../../utils/fake-store'
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id || !/^\d+$/.test(id)) throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  return fetchProduct(id)
})
