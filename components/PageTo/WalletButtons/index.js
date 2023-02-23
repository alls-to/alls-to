import React from 'react'
import { useExtensions } from '@mesonfi/extensions/react'

import ExtWalletButton from './ExtWalletButton'
import classnames from 'classnames'

const DEFAULT_EXTS = ['metamask', 'tronlink', 'martian']

export default function WalletButtons ({ toAddr, onExtAddress }) {
  const { extensions } = useExtensions()
  
  const [extList, setExtList] = React.useState([])

  React.useEffect(() => {
    setTimeout(() => {
      const allExts = extensions.detectAllExtensions().filter(ext => !ext.notInstalled && ext.type !== 'walletconnect').reverse()
      const defaultExts = extensions.detectAllExtensions().filter(ext => DEFAULT_EXTS.includes(ext.id) && ext.type !== 'walletconnect').reverse()
      setExtList(allExts.length > 0 ? allExts : defaultExts)
    }, 100)
  }, [extensions])

  const hideAddress = extList.length > 1

  const onExtActive = (ext) => {
    const restExts = extList.filter(item => item.id !== ext.id)
    setExtList(restExts.concat([ext]))
  }

  return (
    <div className={classnames('flex flex-row-reverse group gap-2 p-1 rounded-full', hideAddress && 'hover:bg-black/10')}>
    {
      extList.reverse().map(ext => (
        <ExtWalletButton
          key={ext.id}
          hideAddress={hideAddress}
          ext={ext}
          toAddr={toAddr}
          onActive={onExtActive}
          onExtAddress={onExtAddress}
        />
      ))
    }
  </div>
  )
}
