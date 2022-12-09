import React from 'react'
import classnames from 'classnames'
import { useRouter } from 'next/router'
import Image from 'next/image'

import { useExtensions } from '@mesonfi/extensions/react'
import { useWeb3Login } from '@mesonfi/web3-jwt/react'

import Container from 'components/common/Container'
import Header from 'components/common/Header'
import Card from 'components/common/Card'
import Button from 'components/common/Button'

import icons from './icons'
import styles from './styles.module.css'

const signingMessage = process.env.NEXT_PUBLIC_SIGNING_MESSAGE

export default function PageIndex() {
  const router = useRouter()
  const { extensions } = useExtensions()
  const { account, login } = useWeb3Login(extensions, signingMessage, { duration: 86400 * 7 })

  React.useEffect(() => {
    if (account?.sub) {
      router.replace(`/edit/${account.sub}`)
    }
  }, [router, account])

  const loading = !account || account.sub

  return (
    <Container className='sm:overflow-y-hidden'>
      <Header />
      <div className={classnames(
        'w-full flex flex-col sm:flex-row items-start justify-between',
        'main-padding mt-8 xs:mt-[50px] gap-12'
      )}>
        <div className='relative flex-1 max-w-[540px] xs:mb-6 sm:mb-0'>
          <div className={classnames('left-[-272px] top-[-110px]', styles.bubble_1)} />
          <div className='relative z-10'>
            <div className='text-title font-extralight mb-2'>
              <div>Simplify Your</div>
              <div className='text-transparent bg-clip-text bg-gradient-to-r from-[#1B4DFF] via-[#2680FF] to-[#34C2FF]'>
                Payment & Life
              </div>
              <div>in Web3</div>
            </div>
            <div className='text-base xs:text-lg sm:text-base md:text-lg font-light mb-6 md:mb-12'>
              Receive fund with certern network & stablecoins. Pay with any network & stablecoin you like, and let alls.to take care of cross-chain.
            </div>
            <div className='w-fit grid grid-cols-7 md:gap-x-6 gap-x-4 gap-y-4'>
            {icons.map((icon, index) => (
              <Image key={`icon-${index}`} alt='' width={24} height={24} src={icon.src} />
            ))}
            </div>
          </div>
        </div>
        <div className='relative self-center sm:self-start max-w-full w-[360px] sm:w-[300px] md:w-[360px] mb-12'>
          <div className='absolute inset-0 z-0'>
            <div className={classnames('left-[96px] top-[-135px]', styles.bubble_shadow_2)} />
            <div className={classnames('left-[96px] top-[-135px]', styles.bubble_2)} />
            <div className={classnames('left-[-76px] top-[346px]', styles.bubble_shadow_3)} />
            <div className={classnames('left-[-76px] top-[346px]', styles.bubble_3)} />
          </div>
          <Card className='z-10'>
            <div className='text-xl font-bold mb-2'>Create My Link</div>
            <div className='mb-5 font-light'>Choose the wallet you want to connect and customize your link.</div>
            <LoginWallets loading={loading} extensions={extensions} login={login} />
          </Card>
        </div>
      </div>
    </Container>
  )
}

function LoginWallets ({ loading, extensions, login }) {
  const [extList, setExtList] = React.useState([])

  React.useEffect(() => {
    setTimeout(() => {
      const exts = extensions.detectAllExtensions().filter(ext => !ext.notInstalled && ext.type !== 'walletconnect')
      setExtList(exts)
    }, 100)
  }, [extensions])

  if (loading) {
    return 'loading...'
  }

  return (
    <div className='flex flex-col gap-4'>
      {extList.map(ext => (
        <Button key={ext.id} className='justify-between' onClick={() => login(ext)}>
          <div>{ext.name}</div>
          <div className='flex w-8 h-8 bg-white items-center justify-center rounded-md'>
            <img alt={ext.name} crossOrigin='anonymous' className='w-6 h-6' src={ext.icon} />
          </div>
        </Button>
      ))}
    </div>
  )
}