import React from 'react'
import { useRouter } from 'next/router'

import AppContainer from 'components/AppContainer'
import Header from 'components/common/Header'

import MesonToSyncedWallet from './MesonToSyncedWallet'
import CardTransfer from './CardTransfer'

export default function PageTo ({ to }) {
  const router = useRouter()
  const [browserExt, setBrowserExt] = React.useState()

  React.useEffect(() => {
    if (!to) {
      router.replace(`/`)
    } else if (to.uid && !location.pathname.endsWith(`/${to.uid}`)) {
      router.replace(`/${to.uid}`)
    }
  }, [router, to])

  return (
    <AppContainer>
      <Header logoSrc='/'>
        <MesonToSyncedWallet browserExt={browserExt} setBrowserExt={setBrowserExt} />
      </Header>
      <CardTransfer to={to} currentAddress={browserExt?.currentAccount?.address} />
    </AppContainer>
  )
}