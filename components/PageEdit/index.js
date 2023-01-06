import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { useExtensions } from '@mesonfi/extensions/react'
import { useWeb3Login } from '@mesonfi/web3-jwt/react'

import Container from 'components/common/Container'
import Header from 'components/common/Header'
import ConnectedButton from 'components/common/ConnectedButton'
import { DropdownMenu } from 'components/common/Dropdown'

import open from 'components/icons/open.svg'
import disconnect from 'components/icons/disconnect.svg'

import EditTo from './EditTo'

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
        <DropdownMenu
          btn={<ConnectedButton browserExt={browserExt} />}
          options={[
            {
              text: <><div className='flex h-4 w-4 mr-2'><Image fill alt='' src={open} /></div>Open My Link</>,
              onClick: () => window.open(`/${to.uid || to.address.substring(0, 12)}`, '_blank')
            },
            {
              text: <><div className='flex h-4 w-4 mr-2'><Image fill alt='' src={disconnect} /></div>Disconnect</>,
              onClick: logout
            }
          ]}
        />
      </Header>
      <EditTo to={to} extensions={extensions} account={account} />
    </Container>
  )
}

// <Image alt='' width={18} height={18} src={disconnect} />
