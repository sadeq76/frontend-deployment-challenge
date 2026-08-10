import { describe, expect, it, vi } from 'vitest'
import { createHttpClient } from '../../../src/lib/http-client'

describe('http client', () => {
  it('builds encoded query strings without mutating caller headers', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } })
      )
    const headers = { Authorization: 'Bearer token' }
    const client = createHttpClient({ baseUrl: 'https://example.test/api', fetch: fetcher })
    await client.get<{ ok: boolean }>('/products', { query: { q: 'gold ring', category: ['jewelery', null] }, headers })
    expect(fetcher.mock.calls[0][0]).toBe('https://example.test/products?q=gold+ring&category=jewelery')
    expect(headers).toEqual({ Authorization: 'Bearer token' })
    expect(new Headers(fetcher.mock.calls[0][1].headers).has('content-type')).toBe(false)
  })

  it('serializes JSON request bodies and reports typed HTTP failures', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: 'nope' }), {
        status: 422,
        headers: { 'content-type': 'application/json' }
      })
    )
    const client = createHttpClient({ baseUrl: 'https://example.test', fetch: fetcher })
    await expect(client.request('/products', { method: 'POST', body: { title: 'A' } })).rejects.toMatchObject({
      kind: 'http',
      response: { status: 422, data: { message: 'nope' } }
    })
    expect(fetcher.mock.calls[0][1].body).toBe('{"title":"A"}')
  })

  it('returns null for an empty successful response', async () => {
    const client = createHttpClient({
      baseUrl: 'https://example.test',
      fetch: vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    })
    await expect(client.get('/products')).resolves.toMatchObject({ data: null, status: 204 })
  })
})
