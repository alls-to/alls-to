import React from 'react'
import classnames from 'classnames'
import { useExtensions } from '@mesonfi/extensions/react'
import useMesonToSyncedExt from './useMesonToSyncedExt'

import ExtWalletButton from './ExtWalletButton'
import { useCustodians } from '@mesonfi/custodians/react'

const DISABLE_WALLETS = process.env.NEXT_PUBLIC_DISABLE_WALLETS.split(',')

export default function WalletButtons ({ toAddr, onExtAddress }) {
  const { extensions } = useExtensions()
  const { custodians } = useCustodians()
  const filterdCustodians = custodians.services.filter(item => !DISABLE_WALLETS.includes(item.id))
  const m2Ext = useMesonToSyncedExt()
  const [extList, setExtList] = React.useState([])

  React.useEffect(() => {
    setTimeout(() => {
      const allExts = extensions.detectAllExtensions()
        .filter(ext => !ext.notInstalled && ext.type !== 'walletconnect')
        .reverse()
      // const defaultExts = extensions.detectAllExtensions()
      //   .filter(ext => DEFAULT_EXTS.includes(ext.id) && ext.type !== 'walletconnect')
      setExtList(allExts.concat(filterdCustodians))
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
          m2Ext={m2Ext}
          onExtAddress={onExtAddress}
        />
      ))
    }
  </div>
  )
}
