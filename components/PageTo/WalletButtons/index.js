import React from 'react'
import { useExtensions } from '@mesonfi/extensions/react'

import ExtWalletButton from './ExtWalletButton'

export default function WalletButtons ({ toAddr, onExtAddress }) {
  const { extensions } = useExtensions()
  
  const [extList, setExtList] = React.useState([])

  React.useEffect(() => {
    setTimeout(() => {
      setExtList(extensions
        .detectAllExtensions()
        .filter(ext => !ext.notInstalled && ext.type !== 'walletconnect')
      )
    }, 100)
  }, [extensions])

  const hideAddress = extList.length > 1

  return extList.map(ext => (
    <ExtWalletButton
      key={ext.id}
      hideAddress={hideAddress}
      ext={ext}
      toAddr={toAddr}
      onExtAddress={onExtAddress}
    />
  ))
}
