import React from 'react'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

import { useExtensions } from '@mesonfi/extensions/react'
import { useWeb3Login } from '@mesonfi/web3-jwt/react'

import { abbreviate } from 'lib'
import * as api from 'lib/api'

import AppContainer from 'components/AppContainer'
import Header from 'components/common/Header'
import ConnectedButton from 'components/common/ConnectedButton'
import { DropdownMenu } from 'components/common/Dropdown'
import CardCreate from './CardCreate'
import Icon from 'components/icons'

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

export default function PageCreate () {
  const router = useRouter()
  const { extensions, browserExt } = useExtensions()
  const { account, login, logout } = useWeb3Login(extensions, signingMessage, { duration: 86400 * 7 })
  const [to, setTo] = React.useState()
  const [extIcon, setExtIcon] = React.useState()

  React.useEffect(() => {
    if (!account) {
      return
    } else if (!account.token) {
      router.replace('/')
      setTo()
      return
    }
    setTo()
    api.createRecipient(account.token)
      .then(setTo)
      .catch(err => console.warn(err))
  }, [router, account])

  const currentAddress = browserExt?.currentAccount?.address
  React.useEffect(() => {
    if (!account || !currentAddress) {
      return
    }
    if (account.sub !== currentAddress) {
      setTo()
      login().catch(() => logout())
    }
  }, [account, currentAddress, login, logout])

  const currentExtIcon = browserExt?.ext?.icon
  React.useEffect(() => {
    if (currentExtIcon) {
      setExtIcon(currentExtIcon)
    }
  }, [currentExtIcon])

  let switching
  if (currentAddress && account?.sub !== currentAddress) {
    switching = true
  }

  const title = to ? `Create → ${to.name || abbreviate(to.address)}` : 'Loading...'
  return (
    <AppContainer>
      <NextSeo title={title} openGraph={{ title }} />
      <Header>
        <DropdownMenu
          btn={<ConnectedButton icon={extIcon} address={account?.sub} />}
          options={[
            {
              text: <><div className='flex h-4 w-4 mr-2'><Icon type='icon-open'/></div>Open My Link</>,
              onClick: () => to && window.open(`/${to.uid || to.address.substring(0, 12)}`, '_blank')
            },
            {
              text: <><div className='flex h-4 w-4 mr-2'><Icon type='icon-disconnect' /></div>Disconnect</>,
              onClick: logout
            }
          ]}
        />
      </Header>
      <CardCreate switching={switching} to={to} account={account} />
    </AppContainer>
  )
}
