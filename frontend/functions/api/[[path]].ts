
interface Context {
  request: Request
}

export const onRequest = async (context: Context): Promise<Response> => {
  const incomingUrl = new URL(context.request.url)

  const isAuthRequest =
    incomingUrl.pathname === '/api/auth' ||
    incomingUrl.pathname.startsWith('/api/auth/')

  const targetOrigin = isAuthRequest
    ? 'https://plp-user-service.onrender.com'
    : 'https://plp-prediction-service.onrender.com'

  const targetUrl = new URL(
    incomingUrl.pathname + incomingUrl.search,
    targetOrigin
  )

  const headers = new Headers(context.request.headers)
  headers.delete('host')
  headers.delete('cookie')

  const upstreamRequest = new Request(targetUrl.toString(), {
    method: context.request.method,
    headers,
    body:
      context.request.method === 'GET' ||
      context.request.method === 'HEAD'
        ? undefined
        : context.request.body,
    redirect: 'manual',
  })

  const response = await fetch(upstreamRequest)

  const responseHeaders = new Headers(response.headers)
  responseHeaders.delete('set-cookie')

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  })
}
