import React from 'react'

import extensions from '@mesonfi/extensions'

export default function ConnectWallet ({ onChange }) {
  const [chainId, setChainId] = React.useState()
  const [addr, setAddr] = React.useState()

  React.useEffect(() => {
    const exts = extensions.detect(window)
    if (exts.length) {
      extensions.connect(exts[0].type, (chainId, account) => {
        setChainId(chainId)
        setAddr(account?.address)
        onChange(chainId, account)
      })
    }
  }, [onChange])

  return (
    <div className='flex flex-col items-start'>
      Connect Wallet
      <code>{chainId}</code>
      <code>{addr}</code>
    </div>
  )
}