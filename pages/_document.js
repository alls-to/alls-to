import {
  Head,
  Html,
  Main,
  NextScript
} from 'next/document'

export default function Document () {
  return (
    <Html lang='en' style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <Head>
        <meta httpEquiv='Content-Type' charSet='utf-8' />
        <meta name='keywords' content='' />
        <meta content='index,follow' name='robots' />
        <meta content='index,follow' name='GOOGLEBOT' />
        <meta content='' name='Author' />

        <meta name='theme-color' content='' />

        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-title' content='Alls To' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />

        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://alls.to/' />

        <link rel='icon' href='/favicon.ico' />
        <link rel='shortcut icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' sizes='192x192' href='/static/logo192.png' />
        <link rel='apple-touch-icon' sizes='512x512' href='/static/logo512.png' />
      </Head>
      <body style={{ width: '100%', height: '100%', margin: '0' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
