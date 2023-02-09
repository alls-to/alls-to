import React from 'react'
import { useRouter } from 'next/router'

import AppContainer from 'components/AppContainer'
import Header from 'components/common/Header'

import WalletButtons from './WalletButtons'
import CardTransfer from './CardTransfer'

export default function PageTo ({ to }) {
  const router = useRouter()
  const [browserExt, setBrowserExt] = React.useState()

  React.useEffect(() => {
    if (!to) {
      router.replace(`/`)
    } else if (!location.pathname.endsWith(`/${to.handle}`)) {
      router.replace(`/${to.handle}`)
    }
  }, [router, to])

  return (
    <AppContainer>
      <Header logoSrc='/'>
        <WalletButtons to={to} browserExt={browserExt} setBrowserExt={setBrowserExt} />
      </Header>
      <CardTransfer key={to.handle} to={to} currentAddress={browserExt?.currentAccount?.address} />
    </AppContainer>
  )
}
