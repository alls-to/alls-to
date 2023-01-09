import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { useExtensions } from '@mesonfi/extensions/react'

import Container from 'components/common/Container'
import Header from 'components/common/Header'
import ConnectedButton from 'components/common/ConnectedButton'
import { DropdownMenu } from 'components/common/Dropdown'
import CentralCardWithSideInfo from 'components/common/Card/CentralCardWithSideInfo'
import Button from 'components/common/Button'

import iconEdit from 'components/icons/edit.svg'
import iconDisconnect from 'components/icons/disconnect.svg'

import ToInfo from './ToInfo'

const steps = []

export default function PageTo ({ to }) {
  const router = useRouter()

  React.useEffect(() => {
    if (!to) {
      router.replace(`/`)
    } else if (to.uid && !location.pathname.endsWith(`/${to.uid}`)) {
      router.replace(`/${to.uid}`)
    }
  }, [router, to])


  const [browserExt, setBrowserExt] = React.useState()

  const onMeson2Event = React.useCallback(({ data }) => {
    if (data.type === 'update-browser-ext') {
      setBrowserExt(data.data)
    }
  }, [])

  React.useEffect(() => {
    window.addEventListener('meson2', onMeson2Event)
    return () => window.removeEventListener('meson2', onMeson2Event)
  }, [onMeson2Event])

  const disconnect = React.useCallback(() => {
    window.postMessage({ to: 'meson2', action: 'disconnect-extension' })
  }, [])

  const currentAddress = browserExt?.currentAccount?.address
  const options = React.useMemo(() => {
    const options = [{
      text: <><div className='flex h-4 w-4 mr-2'><Image fill='true' alt='' src={iconDisconnect} /></div>Disconnect</>,
      onClick: disconnect
    }]

    if (to.address === currentAddress) {
      options.unshift({
        text: <><div className='flex h-4 w-4 mr-2'><Image fill='true' alt='' src={iconEdit} /></div>Edit My Link</>,
        onClick: () => window.open(`/edit`, '_blank')
      })
    }
    return options
  }, [to.address, currentAddress, disconnect])

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