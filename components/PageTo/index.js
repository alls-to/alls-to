import React from 'react'
import { useRouter } from 'next/router'

import AppContainer from 'components/AppContainer'
import Header from 'components/common/Header'

import WalletButtons from './WalletButtons'
import CardTransfer from './CardTransfer'

export default function PageTo ({ to }) {
  const router = useRouter()
  const [extStatus, setExtStatus] = React.useState()
  const [extsAddress, setExtsAddress] = React.useState({})

  React.useEffect(() => {
    if (!to) {
      router.replace(`/`)
    } else if (!location.pathname.endsWith(`/${to.handle}`)) {
      router.replace(`/${to.handle}`)
    }
  }, [router, to])

  const onExtAddress = React.useCallback((extId, address) => {
    setExtsAddress(prev => ({ ...prev, [extId]: address }))
  }, [])

  React.useEffect(() => {
    console.log(extsAddress)
  }, [extsAddress])

  return (
    <AppContainer>
      <Header logoSrc='/'>
        <WalletButtons toAddr={to.addr} onExtAddress={onExtAddress} />
      </Header>
      <CardTransfer
        key={to.handle}
        to={to}
        currentAddress={extStatus?.currentAccount?.address}
      />
    </AppContainer>
  )
}
