import { NextResponse } from 'next/server'

const { NODE_ENV } = process.env

export function middleware(req) {
  if (NODE_ENV === 'production' && req.headers.get('x-forwarded-proto') !== 'https') {
    return NextResponse.redirect(`https://${req.headers.get('host')}${req.nextUrl.pathname}`)
  }
}
