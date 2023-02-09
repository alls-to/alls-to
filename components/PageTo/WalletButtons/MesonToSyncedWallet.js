import React from 'react'
import { useRouter } from 'next/router'

import ConnectedButton from 'components/common/ConnectedButton'
import { DropdownMenu } from 'components/common/Dropdown'
import Icon from 'components/icons'

export default function MesonToSyncedWallet ({ to, browserExt, setBrowserExt }) {
  const router = useRouter()

  const onMeson2Event = React.useCallback(({ data }) => {
    if (data.type === 'update-browser-ext') {
      setBrowserExt(data.data)
    }
  }, [setBrowserExt])

  React.useEffect(() => {
    window.addEventListener('meson2', onMeson2Event)
    return () => window.removeEventListener('meson2', onMeson2Event)
  }, [onMeson2Event])

  const disconnect = React.useCallback(() => {
    window.postMessage({ to: 'meson2', action: 'disconnect-extension' })
  }, [])

  const currentAddress = browserExt?.currentAccount?.address
  const isOwner = currentAddress === to.addr
  const options = React.useMemo(() => {
    const options = [{
      text: <><div className='flex h-4 w-4 mr-2'><Icon type='disconnect'/></div>Disconnect</>,
      onClick: disconnect
    }]

    if (!isOwner) {
      options.unshift({
        text: <><div className='flex h-4 w-4 mr-2'><Icon type='open'/></div>Open My Link</>,
        onClick: () => router.push(`/${currentAddress}`)
      })
    }
    return options
  }, [disconnect, isOwner, router, currentAddress])

  return (
    <DropdownMenu
      btn={<ConnectedButton icon={browserExt?.ext?.icon} addr={currentAddress} />}
      options={options}
    />
  )
}
