import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { useExtensions } from '@mesonfi/extensions/react'
import { useWeb3Login } from '@mesonfi/web3-jwt/react'

import { abbreviate } from 'lib'
import Container from 'components/common/Container'
import Header from 'components/common/Header'
import CentralCardWithSideInfo from 'components/common/Card/CentralCardWithSideInfo'

import EditTo from './EditTo'
import disconnect from './disconnect.png'

const signingMessage = process.env.NEXT_PUBLIC_SIGNING_MESSAGE

const steps = [
  {
    title: 'Choose Link Id',
    desc: 'Link suffix can only be changed once. Choose it wisely.'
  },
  {
    title: 'Update Name & Description',
    desc: 'These two will show up when opening your link.'
  },
  {
    title: 'Choose Network & Token',
    desc: 'You will receive with the network & token you chose no matter which the sender is using.'
  },
  {
    title: 'Save, Preview & Share',
    desc: `When your updates are saved, you're now ready to open your link to preview and send.`
  }
]

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
    <Container>
      <Header>
        {
          browserExt
            ? <img alt={browserExt.name} crossOrigin='anonymous' className='w-6 h-6' src={browserExt.ext.icon} />
            : <div className='w-6 h-6' />
        }
        <div className='font-semibold'>{abbreviate(browserExt?.currentAccount.address)}</div>
        <button
          type='button'
          className='flex items-center justify-center rounded-xl w-10 h-10 text-sm text-black bg-white hover:bg-gray-100 focus:outline-none shadow'
          onClick={logout}
        >
          <Image alt='' width={18} height={18} src={disconnect} />
        </button>
      </Header>
      <CentralCardWithSideInfo steps={[]} >
        <EditTo to={to} extensions={extensions} account={account} />
      </CentralCardWithSideInfo>
    </Container>
  )
}