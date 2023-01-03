import React from 'react'
import classnames from 'classnames'
import { useRouter } from 'next/router'
import groupBy from 'lodash/groupBy'
import mapValues from 'lodash/mapValues'

import { useExtensions } from '@mesonfi/extensions/react'
import { useWeb3Login } from '@mesonfi/web3-jwt/react'

import Container from 'components/common/Container'
import Header from 'components/common/Header'
import Card from 'components/common/Card'
import Button from 'components/common/Button'
import NetworkIcon from 'components/common/Icon/NetworkIcon'

import styles from './styles.module.css'

const signingMessage = process.env.NEXT_PUBLIC_SIGNING_MESSAGE

const icons = 'eth|polygon|bnb|arb|opt|avax|zksync|aurora|tron|aptos|ftm|cronos|movr|beam|cfx'.split('|')

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
          <div className={classnames('left-[-272px] top-[-180px]', styles.bubble)} />
          <div className='relative z-10'>
            <div className='text-title font-extralight mb-2'>
              <div>Simplify Your</div>
              <div className='text-transparent bg-clip-text bg-gradient-to-r from-[#1B4DFF] via-[#2680FF] to-[#34C2FF]'>
                Stablecoin Life
              </div>
              <div>in Web3</div>
            </div>
            <div className='text-base xs:text-lg sm:text-base md:text-lg font-light mb-6 md:mb-12'>
              Receive fund with certern network & stablecoins. Make transfers with any network & stablecoin you like, and let ALLsTo take care of cross-chain.
            </div>
            <div className='w-fit grid grid-cols-8 md:gap-x-6 gap-x-4 gap-y-4'>
            {icons.map(id => (
              <div key={`icon-${id}`} className='w-7 h-7 border-[2px] border-white rounded-full'>
                <NetworkIcon size={28} id={id} />
              </div>
            ))}
            </div>
          </div>
        </div>
        <div className='relative self-center sm:self-start max-w-full w-[360px] sm:w-[300px] md:w-[360px] mb-12'>
          <Card className='p-6 md:p-8'>
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
      const exts = Object.values(mapValues(
        groupBy(
          extensions.detectAllExtensions().filter(ext => ext.type !== 'walletconnect'),
          'type'
        ),
        grouped => grouped.every(ext => ext.notInstalled) ? grouped[0] : grouped.filter(ext => !ext.notInstalled)
      )).flat()
      setExtList(exts)
    }, 100)
  }, [extensions])

  if (loading) {
    return <div className='self-center font-light'>Loading...</div>
  }

  return (
    <div className='flex flex-col gap-4 -mx-6 px-6 md:-mx-8 md:px-8 max-h-[320px] overflow-y-auto'>
      {extList.map(ext => (
        <Button
          key={ext.id}
          size='lg'
          type='glass'
          className='justify-between'
          onClick={() => ext.notInstalled ? window.open(ext.installLink, '_blank') : login(ext)}
        >
          {
            ext.notInstalled
            ? <div className='opacity-50'>Get {ext.name}</div>
            : <div>{ext.name}</div>
          }
          <div className={classnames(
            'flex w-8 h-8 bg-white items-center justify-center rounded-md',
            ext.notInstalled && 'opacity-50'
          )}>
            <img alt={ext.name} crossOrigin='anonymous' className='w-6 h-6' src={ext.icon} />
          </div>
        </Button>
      ))}
    </div>
  )
}