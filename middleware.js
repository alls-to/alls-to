import { NextResponse } from 'next/server'

const { NODE_ENV } = process.env

export function middleware(req) {
  if (NODE_ENV === 'production') {
    // const hasCode = req.nextUrl.pathname.startsWith('/code/')
    // if (hasCode) {
    //   const code = req.nextUrl.pathname.split('/')[2]
  
    //   const response = NextResponse.redirect(`https://${req.headers.get('host')}`)
    //   response.cookies.set('code', code, {
    //     httpOnly: true,
    //     maxAge: 10 * 60,
    //     sameSite: 'strict',
    //   })
    //   return response
    // }
    if (req.headers.get('x-forwarded-proto') !== 'https') {
      return NextResponse.redirect(`https://${req.headers.get('host')}${req.nextUrl.pathname}`)
    }
  }
}
