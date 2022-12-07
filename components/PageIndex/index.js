import React from 'react'
import { useRouter } from 'next/router'

import { useExtensions } from '@mesonfi/extensions/react'
import * as jwt from '@mesonfi/extensions/jwt'

const signingMessage = process.env.NEXT_PUBLIC_SIGNING_MESSAGE

export default function PageIndex() {
  const router = useRouter()
  const { extensions, browserExt } = useExtensions()
  const [extList, setExtList] = React.useState([])

  React.useEffect(() => {
    const token = window.localStorage.getItem('token')
    if (token) {
      try {
        const payload = jwt.verify(token, signingMessage)
        router.push(`/edit/${payload.sub}`)
      } catch {
        window.localStorage.removeItem('token')
      }
    }
  }, [router])

  React.useEffect(() => {
    const exts = extensions.detectAllExtensions().filter(ext => !ext.notInstalled && ext.type !== 'walletconnect')
    setExtList(exts)
  }, [extensions])

  const onClickExt = React.useCallback(async (evt, ext) => {
    await extensions.connect(undefined, ext.type, ext.id)
    const token = await jwt.encode(extensions.currentExt, signingMessage)
    window.localStorage.setItem('token', token)
    router.push(`/edit/${extensions.currentExt.currentAccount.address}`)
  }, [router, extensions])

  return (
    <div className='flex flex-col items-center pt-24 '>
      {extList.map(ext => (
        <div key={ext.id} onClick={evt => onClickExt(evt, ext)}>
          <div className='px-4 py-2 flex items-center text-gray-700 hover:bg-gray-100 cursor-pointer'>
            <img alt={ext.name} crossOrigin='anonymous' className='w-5 h-5 mr-2' src={ext.icon} />
            {ext.name}
          </div>
        </div>
      ))}
    </div>
  )
}
