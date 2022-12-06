import Head from 'next/head'
import 'styles/index.css'

import extensions from 'lib/extensions'
import { ExtensionProvider } from '@mesonfi/extensions/react'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' />
      </Head>
      <ExtensionProvider extensions={extensions}>
        <Component {...pageProps} />
      </ExtensionProvider>
    </>
  )
}
