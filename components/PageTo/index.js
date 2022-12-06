import React from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import { useExtensions } from '@mesonfi/extensions/react'

import ConnectWallet from './ConnectWallet'
import ForOwner from './ForOwner'
import ForSender from './ForSender'

const MesonToButton = dynamic(import('@mesonfi/to'), { ssr: false })

export default function PageTo ({ to }) {
  const router = useRouter()
  const { extensions, networkId, browserExt } = useExtensions()

  React.useEffect(() => {
    if (!browserExt?.currentAccount) {
      router.push(`/`)
    } else if (to.address !== browserExt.currentAccount.address) {
      router.push(`/edit/${browserExt.currentAccount.address}`)
    }
  }, [browserExt, router, to.address])

  // const [to, setTo] = React.useState(props.to)

  // const isOwner = to.address === addr

  return (
    <div className='flex flex-col items-start p-12'>
      {to.address}
      <button
        type='button'
        className='mt-24 items-center rounded-md px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none'
        onClick={() => extensions.disconnect()}
      >
        Disconnect
      </button>
      <ForOwner to={to} onUpdated={() => {}} />
      <MesonToButton
        appId='alls-to'
        type='iframe'
        to={to}
        onCompleted={() => {}}
      >
        Send Now
      </MesonToButton>
    </div>
  )
}