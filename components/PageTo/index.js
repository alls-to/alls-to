import React from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import { useExtensions } from '@mesonfi/extensions/react'

import { abbreviate } from 'lib'
import Container from 'components/common/Container'
import Header from 'components/common/Header'

import bg from 'components/common/bg.jpg'

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
    <Container bg={bg}>
      <Header>
        {
          browserExt
            ? <img alt={browserExt.name} crossOrigin='anonymous' className='w-6 h-6' src={browserExt.ext.icon} />
            : <div className='w-6 h-6' />
        }
        <div className='font-bold'>{abbreviate(browserExt?.currentAccount.address)}</div>
        <button
          type='button'
          className='items-center rounded-xl w-10 h-10 text-sm font-medium text-black bg-white hover:bg-gray-100 focus:outline-none shadow-md font-light text-lg'
        >
          x
        </button>
      </Header>
      <ToInfo to={to} />
      {/* <MesonToButton
        appId='alls-to'
        type='iframe'
        to={to}
        onCompleted={() => {}}
      >
        Send Now
      </MesonToButton> */}
    </Container>
  )
}