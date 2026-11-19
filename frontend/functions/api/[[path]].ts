
interface Env {
  PLP_PROXY_SECRET?: string
}

interface Context {
  request: Request
  env: Env
}

export const onRequest = async (context: Context): Promise<Response> => {
  const incomingUrl = new URL(context.request.url)

  const isUserServiceRequest =
    incomingUrl.pathname === '/api/auth' ||
    incomingUrl.pathname.startsWith('/api/auth/') ||
    incomingUrl.pathname === '/api/users' ||
    incomingUrl.pathname.startsWith('/api/users/')

  const targetOrigin = isUserServiceRequest
    ? 'https://plp-user-service.onrender.com'
    : 'https://plp-prediction-service.onrender.com'

  const targetUrl = new URL(
    incomingUrl.pathname + incomingUrl.search,
    targetOrigin
  )

  const headers = new Headers(context.request.headers)

  headers.delete('host')
  headers.delete('cookie')

  // Ne jamais transmettre les en-têtes d'identification fournis par le client.
  headers.delete('X-PLP-Proxy-Secret')
  headers.delete('X-PLP-Client-IP')

  if (isUserServiceRequest && context.env.PLP_PROXY_SECRET) {
    const clientIp = context.request.headers.get('CF-Connecting-IP')

    if (clientIp) {
      headers.set('X-PLP-Proxy-Secret', context.env.PLP_PROXY_SECRET)
      headers.set('X-PLP-Client-IP', clientIp)
    }
  }

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
