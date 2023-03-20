import Head from 'next/head'
import 'styles/index.css'

import { ExtensionProvider } from '@mesonfi/extensions/react'
import extensions from 'lib/extensions'
import { CustodianProvider } from '@mesonfi/custodians/react'
import CustodianServiceManager from '@mesonfi/custodians'

const PARTICLE_PROJECT_ID = process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID
const PARTICLE_CLIENT_ID = process.env.NEXT_PUBLIC_PARTICLE_CLIENT_ID
const PARTICLE_APP_ID = process.env.NEXT_PUBLIC_PARTICLE_APP_ID
const MAGIC_LINK_PUBLIC_KEY = process.env.NEXT_PUBLIC_MAGIC_LINK_PUBLIC_KEY

const CUSTODIAN_CONFIGS = {
  particle: {
    PARTICLE_PROJECT_ID,
    PARTICLE_CLIENT_ID,
    PARTICLE_APP_ID
  },
  magicLink: {
    MAGIC_LINK_PUBLIC_KEY
  }
}

export default function App({ Component, pageProps }) {
  const custodians = new CustodianServiceManager(CUSTODIAN_CONFIGS)
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' />
      </Head>
      <ExtensionProvider extensions={extensions}>
        <CustodianProvider custodians={custodians}>
          <Component {...pageProps} />
        </CustodianProvider>
      </ExtensionProvider>
    </>
  )
}
