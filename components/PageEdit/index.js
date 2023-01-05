import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { useExtensions } from '@mesonfi/extensions/react'
import { useWeb3Login } from '@mesonfi/web3-jwt/react'

import { abbreviate } from 'lib'
import Container from 'components/common/Container'
import Header from 'components/common/Header'
import Button from 'components/common/Button'

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
        <Button
          size='sm'
          type='white'
          onClick={logout}
        >
          <div className='w-7 h-7 p-1 mr-2'>
          {
            browserExt &&
            <img alt={browserExt.name} crossOrigin='anonymous' className='w-5 h-5' src={browserExt.ext.icon} />
          }
          </div>
          <div className='hidden sm:block'>{abbreviate(browserExt?.currentAccount.address, 6)}</div>
          <div className='block sm:hidden'>{abbreviate(browserExt?.currentAccount.address)}</div>
        </Button>
      </Header>
      <EditTo to={to} extensions={extensions} account={account} />
    </Container>
  )
}

// <Image alt='' width={18} height={18} src={disconnect} />
