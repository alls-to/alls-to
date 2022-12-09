import React from 'react'
import classnames from 'classnames'
import { useRouter } from 'next/router'

import { useExtensions } from '@mesonfi/extensions/react'
import { useWeb3Login } from '@mesonfi/web3-jwt/react'

import Container from 'components/common/Container'
import Header from 'components/common/Header'
import Card from 'components/common/Card'
import Button from 'components/common/Button'

import bg from 'components/common/bg.jpg'

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
    <Container bg={bg} style={{ backgroundPosition: '25vw 0%' }}>
      <Header />
      <div className={classnames(
        'w-full flex flex-col md:flex-row items-start justify-between',
        'xl:px-32 lg:px-24 md:px-16 px-8 md:mt-20 mt-6 md:gap-10 gap-6',
      )}>
        <div className='flex-1 max-w-[480px]'>
          <div className='xl:text-[64px] lg:text-[56px] md:text-[38px] text-[44px] font-light mb-2'>
            <div>Simplify Your</div>
            <div className='text-indigo-700'>Payment & Life</div>
            <div>in Web3</div>
          </div>
          <div className='text-lg font-light md:mb-10 mb-0'>
            Receive fund with certern network & stablecoins. Pay with any network & stablecoin you like, and let alls.to take care of cross-chain.
          </div>
          <div className='w-fit hidden md:grid grid-cols-6 md:gap-x-6 gap-x-4 gap-y-4'>
            <div className='w-6 h-6 bg-gray-100 rounded-full'></div>
            <div className='w-6 h-6 bg-gray-100 rounded-full'></div>
            <div className='w-6 h-6 bg-gray-100 rounded-full'></div>
            <div className='w-6 h-6 bg-gray-100 rounded-full'></div>
            <div className='w-6 h-6 bg-gray-100 rounded-full'></div>
            <div className='w-6 h-6 bg-gray-100 rounded-full'></div>
            <div className='w-6 h-6 bg-gray-100 rounded-full'></div>
            <div className='w-6 h-6 bg-gray-100 rounded-full'></div>
            <div className='w-6 h-6 bg-gray-100 rounded-full'></div>
            <div className='w-6 h-6 bg-gray-100 rounded-full'></div>
            <div className='w-6 h-6 bg-gray-100 rounded-full'></div>
            <div className='w-6 h-6 bg-gray-100 rounded-full'></div>
          </div>
        </div>
        <Card className='w-[360px] mb-12'>
          <div className='text-2xl font-bold mb-2'>Create My Link</div>
          <div className='mb-5'>Choose a wallet to create your alls.to link</div>
          <LoginWallets loading={loading} extensions={extensions} login={login} />
        </Card>
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
            <img alt={ext.name} crossOrigin='anonymous' className='w-5 h-5' src={ext.icon} />
          </div>
        </Button>
      ))}
    </div>
  )
}