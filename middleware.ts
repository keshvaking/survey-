import { NextRequest, NextResponse } from 'next/server'

// Protects /admin with HTTP Basic Auth so survey respondents' emails/phone
// numbers aren't publicly readable by anyone who finds the URL.
// Set ADMIN_USER and ADMIN_PASSWORD in your Vercel project env vars.
export function middleware(request: NextRequest) {
  const auth = request.headers.get('authorization')

  const expectedUser = process.env.ADMIN_USER
  const expectedPass = process.env.ADMIN_PASSWORD

  // Fail closed: if the env vars aren't set, block access rather than
  // silently leaving the route open.
  if (!expectedUser || !expectedPass) {
    return new NextResponse('Admin auth is not configured.', { status: 503 })
  }

  if (auth) {
    const [scheme, encoded] = auth.split(' ')
    if (scheme === 'Basic' && encoded) {
      const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
      const separatorIndex = decoded.indexOf(':')
      const user = decoded.slice(0, separatorIndex)
      const pass = decoded.slice(separatorIndex + 1)

      if (user === expectedUser && pass === expectedPass) {
        return NextResponse.next()
      }
    }
  }

  return new NextResponse('Authentication required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Sarthi Admin"' },
  })
}

export const config = {
  matcher: '/admin/:path*',
}
