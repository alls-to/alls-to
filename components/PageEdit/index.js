import React from 'react'
import { useRouter } from 'next/router'

import { useExtensions } from '@mesonfi/extensions/react'
import * as jwt from '@mesonfi/extensions/jwt'

import ForOwner from './ForOwner'

const signingMessage = process.env.NEXT_PUBLIC_SIGNING_MESSAGE

const getExtTypeFromAddress = addr => {
  return 'metamask'
}

const autoConnect = async (extensions, addr) => {
  if (!extensions.currentExt) {
    await extensions.connect(undefined, getExtTypeFromAddress(addr))
  }

  const { address } = extensions.currentExt?.currentAccount || {}
  if (address === addr) {
    const token = await jwt.encode(extensions.currentExt, signingMessage)
    window.localStorage.setItem('token', token)
  }
}

export default function PageTo ({ to }) {
  const router = useRouter()
  const { extensions, browserExt } = useExtensions()

  React.useEffect(() => {
    const token = window.localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwt.verify(token, signingMessage)
        if (to.address !== decoded.sub) {
          router.push(`/edit/${decoded.sub}`)
        }
        if (!extensions.currentExt) {
          const [extType, extId] = decoded.iss.split(':')
          extensions.connect(undefined, extType, extId).catch(e => {})
        }
        return
      } catch (e) {
        console.warn(e)
        window.localStorage.removeItem('token')
      }
    }

    autoConnect(extensions, to.address).catch(() => {
      router.push(`/`)
    })
  }, [router, extensions, to.address])

  const disconnect = React.useCallback(() => {
    extensions.disconnect()
    window.localStorage.removeItem('token')
    router.push(`/`)
  }, [router, extensions])

  return (
    <div className='flex flex-col items-start p-12'>
      Address: {to.address}
      <br />
      Connected: {browserExt?.currentAccount.address}
      <button
        type='button'
        className='items-center rounded-md px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none'
        onClick={disconnect}
      >
        Log out
      </button>
      <ForOwner to={to} extensions={extensions} browserExt={browserExt} />
    </div>
  )
}