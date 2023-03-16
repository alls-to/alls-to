import React from 'react'
import { useRouter } from 'next/router'
import debounce from 'lodash/debounce'

import AppContainer from 'components/AppContainer'
import Header from 'components/common/Header'

import WalletButtons from './WalletButtons'
import CardTransfer from './CardTransfer'

export default function PageTo ({ to }) {
  const router = useRouter()
  const [extsAddress, setExtsAddress] = React.useState({})

  React.useEffect(() => {
    if (!to) {
      router.replace(`/`)
    } else {
      router.replace(`/${to.key}`)
    }
  }, [router, to])

  const onExtAddress = React.useMemo(() => debounce((extId, address) => {
    setExtsAddress(prev => ({ ...prev, [extId]: address }))
  }, 200), [])

  const matchExt = React.useMemo(
    () => Object.entries(extsAddress).find(entry => entry[1] === to.addr)?.[0],
    [extsAddress, to.addr]
  )

  return (
    <AppContainer>
      <Header logoSrc='/'>
        <WalletButtons toAddr={to.addr} onExtAddress={onExtAddress} />
      </Header>
      <CardTransfer key={to.handle} to={to} matchExt={matchExt} />
    </AppContainer>
  )
}
