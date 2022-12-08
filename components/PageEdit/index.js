import React from 'react'
import classnames from 'classnames'
import { useRouter } from 'next/router'

import { useExtensions } from '@mesonfi/extensions/react'
import { useWeb3Login } from '@mesonfi/web3-jwt/react'

import { abbreviate } from 'lib'
import EditTo from './EditTo'

import bg from './bg.jpg'

const signingMessage = process.env.NEXT_PUBLIC_SIGNING_MESSAGE

export default function PageEdit ({ to }) {
  const router = useRouter()
  const { extensions, browserExt } = useExtensions()
  const { account, logout } = useWeb3Login(extensions, signingMessage, to.address)

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
    <div
      className={classnames(
        'flex flex-col items-center h-full overflow-auto',
        'bg-cover bg-top	bg-no-repeat'
      )}
      style={{ backgroundImage: `url(${bg.src})` }}
    >
      <div className='w-full flex flex-row items-center justify-between mt-5 pl-8 pr-9 h-10'>
        <div className='flex bg-gray-400 text-white h-[30px] w-[120px] font-light items-center justify-center'>ALLS.TO LOGO</div>
        <div className='flex flex-row items-center gap-2.5'>
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
        </div>
      </div>
      <EditTo to={to} extensions={extensions} account={account} />
    </div>
  )
}