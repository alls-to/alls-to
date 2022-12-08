import React from 'react'
import { useRouter } from 'next/router'

import { useExtensions } from '@mesonfi/extensions/react'
import { useWeb3Login } from '@mesonfi/web3-jwt/react'

const signingMessage = process.env.NEXT_PUBLIC_SIGNING_MESSAGE

export default function PageIndex() {
  const router = useRouter()
  const { extensions } = useExtensions()
  const { account, login } = useWeb3Login(extensions, signingMessage)
  const [extList, setExtList] = React.useState([])

  React.useEffect(() => {
    setTimeout(() => {
      const exts = extensions.detectAllExtensions().filter(ext => !ext.notInstalled && ext.type !== 'walletconnect')
      setExtList(exts)
    }, 100)
  }, [extensions])

  React.useEffect(() => {
    if (account?.sub) {
      router.push(`/edit/${account.sub}`)
    }
  }, [router, account])

  if (!account || account.sub) {
    return 'loading...'
  }

  return (
    <div className='flex flex-col items-center pt-24 '>
      {extList.map(ext => (
        <div key={ext.id} onClick={() => login(ext)}>
          <div className='px-4 py-2 flex items-center text-gray-700 hover:bg-gray-100 cursor-pointer'>
            <img alt={ext.name} crossOrigin='anonymous' className='w-5 h-5 mr-2' src={ext.icon} />
            {ext.name}
          </div>
        </div>
      ))}
    </div>
  )
}
