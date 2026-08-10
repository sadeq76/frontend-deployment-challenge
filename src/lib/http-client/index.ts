export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
export type QueryValue =
  string | number | boolean | null | undefined | Array<string | number | boolean | null | undefined>

export interface RequestConfig<TBody = unknown> {
  method?: HttpMethod
  headers?: HeadersInit
  query?: Record<string, QueryValue>
  body?: TBody
  signal?: AbortSignal
  timeoutMs?: number
}

export interface HttpResponse<T> {
  data: T | null
  status: number
  statusText: string
  headers: Headers
}

export class HttpClientError<T = unknown> extends Error {
  readonly response?: HttpResponse<T>
  readonly kind: 'http' | 'network' | 'aborted' | 'timeout'

  constructor(message: string, kind: HttpClientError<T>['kind'], response?: HttpResponse<T>, options?: ErrorOptions) {
    super(message, options)
    this.name = 'HttpClientError'
    this.kind = kind
    this.response = response
  }
}

export interface HttpClientOptions {
  baseUrl: string
  defaultHeaders?: HeadersInit
  timeoutMs?: number
  fetch?: typeof globalThis.fetch
}

function buildUrl(baseUrl: string, path: string, query?: Record<string, QueryValue>) {
  const url = new URL(path, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`)
  for (const [key, rawValue] of Object.entries(query ?? {})) {
    const values = Array.isArray(rawValue) ? rawValue : [rawValue]
    for (const value of values) if (value !== null && value !== undefined) url.searchParams.append(key, String(value))
  }
  return url.toString()
}

async function parseResponse(response: Response): Promise<unknown | null> {
  if (response.status === 204 || response.status === 205) return null
  const type = response.headers.get('content-type')?.toLowerCase() ?? ''
  const text = await response.text()
  if (!text) return null
  if (type.includes('application/json')) {
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  }
  return text
}

function combinedSignal(external: AbortSignal | undefined, timeoutMs: number | undefined) {
  if (!timeoutMs) return { signal: external, cleanup: () => undefined, timedOut: () => false }
  const controller = new AbortController()
  let timeoutTriggered = false
  const timer = setTimeout(() => {
    timeoutTriggered = true
    controller.abort()
  }, timeoutMs)
  const abort = () => controller.abort()
  external?.addEventListener('abort', abort, { once: true })
  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timer)
      external?.removeEventListener('abort', abort)
    },
    timedOut: () => timeoutTriggered
  }
}

export function createHttpClient(options: HttpClientOptions) {
  const fetcher = options.fetch ?? globalThis.fetch

  async function request<TResponse, TBody = unknown>(
    path: string,
    config: RequestConfig<TBody> = {}
  ): Promise<HttpResponse<TResponse>> {
    const method = config.method ?? 'GET'
    const headers = new Headers(options.defaultHeaders)
    new Headers(config.headers).forEach((value, key) => headers.set(key, value))
    const hasBody = config.body !== undefined && method !== 'GET' && method !== 'HEAD'
    let body: BodyInit | undefined
    if (hasBody) {
      if (
        config.body instanceof FormData ||
        config.body instanceof URLSearchParams ||
        typeof config.body === 'string' ||
        config.body instanceof Blob
      )
        body = config.body
      else {
        headers.set('content-type', headers.get('content-type') ?? 'application/json')
        body = JSON.stringify(config.body)
      }
    }
    const control = combinedSignal(config.signal, config.timeoutMs ?? options.timeoutMs)
    try {
      const response = await fetcher(buildUrl(options.baseUrl, path, config.query), {
        method,
        headers,
        body,
        signal: control.signal
      })
      const result: HttpResponse<TResponse> = {
        data: (await parseResponse(response)) as TResponse | null,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      }
      if (!response.ok) throw new HttpClientError(`Request failed with status ${response.status}`, 'http', result)
      return result
    } catch (error) {
      if (error instanceof HttpClientError) throw error
      if (control.timedOut()) throw new HttpClientError('Request timed out', 'timeout', undefined, { cause: error })
      if (config.signal?.aborted) throw new HttpClientError('Request aborted', 'aborted', undefined, { cause: error })
      throw new HttpClientError('Network request failed', 'network', undefined, { cause: error })
    } finally {
      control.cleanup()
    }
  }

  return {
    request,
    get: <T>(path: string, config?: Omit<RequestConfig<never>, 'method'>) =>
      request<T>(path, { ...config, method: 'GET' })
  }
}
