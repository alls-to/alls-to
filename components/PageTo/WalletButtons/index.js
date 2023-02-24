import React from 'react'
import { useExtensions } from '@mesonfi/extensions/react'

import ExtWalletButton from './ExtWalletButton'
import classnames from 'classnames'

const DEFAULT_EXTS = ['metamask', 'tronlink', 'martian']

export default function WalletButtons ({ toAddr, onExtAddress }) {
  const { extensions } = useExtensions()
  
  const [extList, setExtList] = React.useState([])
  const [activeExt, setActiveExt] = React.useState()

  React.useEffect(() => {
    setTimeout(() => {
      const allExts = extensions.detectAllExtensions()
        .filter(ext => !ext.notInstalled && ext.type !== 'walletconnect')
        .reverse()
      // const defaultExts = extensions.detectAllExtensions()
      //   .filter(ext => DEFAULT_EXTS.includes(ext.id) && ext.type !== 'walletconnect')
      setExtList(allExts)
    }, 200)
  }, [extensions])

  const hideAddress = extList.length > 1

  return (
    <div className={classnames('flex flex-row-reverse group gap-2 p-1 rounded-full', hideAddress && 'hover:bg-black/10')}>
    {
      extList.map(ext => (
        <ExtWalletButton
          key={ext.id}
          hideAddress={hideAddress}
          ext={ext}
          toAddr={toAddr}
          active={ext.id === activeExt}
          onActive={ext => setActiveExt(ext.id)}
          onExtAddress={onExtAddress}
        />
      ))
    }
  </div>
  )
}
