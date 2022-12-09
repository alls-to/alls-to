import React from 'react'
import { useRouter } from 'next/router'

import Container from 'components/common/Container'
import Header from 'components/common/Header'

import bg from 'components/common/bg2.jpg'

import ToInfo from './ToInfo'

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
    <Container bg={bg}>
      <Header logoSrc='https://alls.to' />
      <ToInfo to={to} />
    </Container>
  )
}