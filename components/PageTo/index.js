import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { useExtensions } from '@mesonfi/extensions/react'
import { useWeb3Login } from '@mesonfi/web3-jwt/react'

import Container from 'components/common/Container'
import Header from 'components/common/Header'
import ConnectedButton from 'components/common/ConnectedButton'
import { DropdownMenu } from 'components/common/Dropdown'
import CentralCardWithSideInfo from 'components/common/Card/CentralCardWithSideInfo'
import Button from 'components/common/Button'

import edit from 'components/icons/edit.svg'
import disconnect from 'components/icons/disconnect.svg'

import ToInfo from './ToInfo'

const signingMessage = process.env.NEXT_PUBLIC_SIGNING_MESSAGE

const steps = []

export default function PageTo ({ to }) {
  const router = useRouter()
  const { extensions, browserExt } = useExtensions()
  const { account, logout } = useWeb3Login(extensions, signingMessage, { duration: 86400 * 7, loginAddress: to.address })

  React.useEffect(() => {
    if (!to) {
      router.replace(`/`)
    } else if (to.uid && !location.pathname.endsWith(`/${to.uid}`)) {
      router.replace(`/${to.uid}`)
    }
  }, [router, to])

  const currentAddress = browserExt?.currentAccount.address
  const options = React.useMemo(() => {
    const options = [{
      text: <><div className='flex h-4 w-4 mr-2'><Image fill alt='' src={disconnect} /></div>Disconnect</>,
      onClick: logout
    }]

    if (to.address === currentAddress) {
      options.unshift({
        text: <><div className='flex h-4 w-4 mr-2'><Image fill alt='' src={edit} /></div>Edit My Link</>,
        onClick: () => window.open(`/edit/${to.uid}`, '_blank')
      })
    }
    return options
  }, [to.address, to.uid, currentAddress, logout])

  return (
    <Container>
      <Header logoSrc='https://alls.to'>
        <DropdownMenu
          btn={<ConnectedButton browserExt={browserExt} />}
          options={options}
        />
      </Header>
      <CentralCardWithSideInfo
        networkId={to.networkId}
        token={to.tokens[0]}
        // side='How to make transfer with ALLsTo?'
        // steps={steps}
        button={
          <Button
            as='a'
            type='transparent'
            size='xs'
            className='text-sm'
            href='https://alls.to'
            target='_blank'
            rel='noreferrer'
          >Create My Link</Button>
        }
      >
        <ToInfo to={to} />
      </CentralCardWithSideInfo>
    </Container>
  )
}