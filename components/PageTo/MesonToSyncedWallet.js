import React from 'react'
import Image from 'next/image'

import ConnectedButton from 'components/common/ConnectedButton'
import { DropdownMenu } from 'components/common/Dropdown'

import iconDisconnect from 'components/icons/disconnect.svg'

export default function MesonToSyncedWallet ({ browserExt, setBrowserExt }) {
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
  const options = React.useMemo(() => {
    const options = [{
      text: <><div className='flex h-4 w-4 mr-2'><Image fill='true' alt='' src={iconDisconnect} /></div>Disconnect</>,
      onClick: disconnect
    }]

    // if (isOwner) {
    //   options.unshift({
    //     text: <><div className='flex h-4 w-4 mr-2'><Image fill='true' alt='' src={iconEdit} /></div>Edit My Link</>,
    //     onClick: () => window.open(`/edit`, '_blank')
    //   })
    // }
    return options
  }, [disconnect])

  return (
    <DropdownMenu
      btn={<ConnectedButton icon={browserExt?.ext?.icon} address={currentAddress} />}
      options={options}
    />
  )
}