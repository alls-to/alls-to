import React from 'react'
import { useRouter } from 'next/router'
import debounce from 'lodash/debounce'

import mesonPresets from '@mesonfi/presets'

import AppContainer from 'components/AppContainer'
import Header from 'components/common/Header'

import WalletButtons from './WalletButtons'
import CardTransfer from './CardTransfer'
// import RewardModal from './RewardModal'
import * as api from 'lib/api'

export default function PageTo ({ to }) {
  const router = useRouter()
  // const rewardModalRef = React.useRef()
  const [loading, setLoading] = React.useState(true)
  const [extsAddress, setExtsAddress] = React.useState({})
  const addr = to?.addr

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    if (!mesonPresets.getNetwork(to.networkId)) {
      const isTestnet = !!mesonPresets.getNetwork('goerli')
      mesonPresets.useTestnet(!isTestnet)
    }
    setLoading(false)
  }, [to.networkId])

  React.useEffect(() => {
    if (!to) {
      router.replace(`/`)
    } else {
      const link = to.key || to.handle
      if (!location.pathname.endsWith(`/${link}`)) {
        router.replace(`/${link}`)
      }
    }
  }, [router, to])

  // React.useEffect(() => {
  //   if (addr) {
  //     (async () => {
  //       const result = await api.queryAndSendReward(to.addr)
  //       if (result) {
  //         rewardModalRef.current.open(result)
  //       }
  //     })()
  //   }
  // }, [addr])

  const onExtAddress = React.useMemo(() => debounce((extId, address) => {
    setExtsAddress(prev => ({ ...prev, [extId]: address }))
  }, 200), [])

  const matchExt = React.useMemo(
    () => Object.entries(extsAddress).find(entry => entry[1] === to.addr)?.[0],
    [extsAddress, to.addr]
  )

  if (loading) {
    return null
  }

  return (
    <AppContainer>
      <Header logoSrc='/'>
        <WalletButtons toAddr={to.addr} onExtAddress={onExtAddress} />
      </Header>
      <CardTransfer key={to.key} to={to} matchExt={matchExt} />
      {/* <RewardModal ref={rewardModalRef} /> */}
    </AppContainer>
  )
}
