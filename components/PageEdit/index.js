import React from 'react'
import { useRouter } from 'next/router'

import { useExtensions } from '@mesonfi/extensions/react'
import { useWeb3Login } from '@mesonfi/web3-jwt/react'

import ForOwner from './ForOwner'

const signingMessage = process.env.NEXT_PUBLIC_SIGNING_MESSAGE

export default function PageTo ({ to }) {
  const router = useRouter()
  const { extensions, browserExt } = useExtensions()
  const { account, logout } = useWeb3Login(extensions, signingMessage, to.address)

  React.useEffect(() => {
    if (!account) {
      return
    }
    if (!account.sub) {
      router.push('/')
    } else if (account.sub !== to.address) {
      router.push(`/edit/${account.sub}`)
    }
  }, [router, account, to.address])

  return (
    <div className='flex flex-col items-start p-12'>
      Address: {to.address}
      <br />
      Connected: {browserExt?.currentAccount.address}
      <button
        type='button'
        className='items-center rounded-md px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none'
        onClick={logout}
      >
        Log out
      </button>
      <ForOwner to={to} extensions={extensions} account={account} />
    </div>
  )
}