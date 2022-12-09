import React from 'react'
import { useRouter } from 'next/router'

import { useExtensions } from '@mesonfi/extensions/react'
import { useWeb3Login } from '@mesonfi/web3-jwt/react'

import { abbreviate } from 'lib'
import Container from 'components/common/Container'
import Header from 'components/common/Header'

import bg from 'components/common/bg.jpg'
import EditTo from './EditTo'

const signingMessage = process.env.NEXT_PUBLIC_SIGNING_MESSAGE

export default function PageEdit ({ to }) {
  const router = useRouter()
  const { extensions, browserExt } = useExtensions()
  const { account, logout } = useWeb3Login(extensions, signingMessage, { duration: 86400 * 7, loginAddress: to.address })

  React.useEffect(() => {
    if (!account) {
      return
    }
    if (!account.sub) {
      router.replace('/')
    } else if (account.sub !== to.address) {
      router.replace(`/edit/${account.sub}`)
    } else if (to.uid && !location.pathname.endsWith(`/${to.uid}`)) {
      router.replace(`/edit/${to.uid}`)
    }
  }, [router, account, to])

  if (!account || account.sub !== to.address) {
    return null
  }

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
          onClick={logout}
        >
          x
        </button>
      </Header>
      <EditTo to={to} extensions={extensions} account={account} />
    </Container>
  )
}