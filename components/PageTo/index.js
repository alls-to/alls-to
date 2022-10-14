import React from 'react'
import dynamic from 'next/dynamic'

import ConnectWallet from './ConnectWallet'
import ForOwner from './ForOwner'
import ForSender from './ForSender'

const MesonToButton = dynamic(import('@mesonfi/to'), { ssr: false })

export default function PageTo (props) {
  const [to, setTo] = React.useState(props.to)
  const [addr, setAddr] = React.useState()

  const isOwner = to.address === addr

  const onWalletChange = (_, account) => {
    setAddr(account?.address)
  }

  return (
    <div className='flex flex-col items-start p-12'>
      <ConnectWallet onChange={onWalletChange} />
      <MesonToButton
        appId='alls-to'
        type='iframe'
        to={to}
        onCompleted={() => {}}
      >
        {isOwner ? 'Test Send' : 'Send Now'}
      </MesonToButton>
      {isOwner ? <ForOwner to={to} onUpdated={setTo} /> : <ForSender to={to} />}
    </div>
  )
}