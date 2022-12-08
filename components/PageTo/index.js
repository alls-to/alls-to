import React from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import { useExtensions } from '@mesonfi/extensions/react'

import ConnectWallet from './ConnectWallet'
import ToInfo from './ToInfo'

const MesonToButton = dynamic(import('@mesonfi/to'), { ssr: false })

export default function PageTo ({ to }) {
  const router = useRouter()
  const { extensions, browserExt } = useExtensions()

  React.useEffect(() => {
    if (!to) {
      router.replace(`/`)
    } else if (to.uid && !location.pathname.endsWith(`/${to.uid}`)) {
      router.replace(`/${to.uid}`)
    }
  }, [router, to])

  return (
    <div className='flex flex-col items-center pt-12'>
      <ToInfo to={to} />
      {/* <MesonToButton
        appId='alls-to'
        type='iframe'
        to={to}
        onCompleted={() => {}}
      >
        Send Now
      </MesonToButton> */}
    </div>
  )
}