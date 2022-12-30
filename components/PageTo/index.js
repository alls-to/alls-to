import React from 'react'
import { useRouter } from 'next/router'

import Container from 'components/common/Container'
import Header from 'components/common/Header'
import CentralCardWithSideInfo from 'components/common/Card/CentralCardWithSideInfo'
import Button from 'components/common/Button'

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

  return (
    <Container>
      <Header logoSrc='https://alls.to' />
      <CentralCardWithSideInfo
        networkId={to.networkId}
        token={to.tokens[0]}
        // side='How to pay with Alls.To?'
        // steps={steps}
        button={
          <Button
            as='a'
            type='transparent'
            size='sm'
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