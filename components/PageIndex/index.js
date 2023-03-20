import React from 'react'
import classnames from 'classnames'
import { useRouter } from 'next/router'

import { useExtensions } from '@mesonfi/extensions/react'
import { useCustodians } from '@mesonfi/custodians/react'
import { useWeb3Login } from '@mesonfi/web3-jwt/react'

import { showInfoToast, showErrorToast } from 'lib/refs'
import * as api from 'lib/api'

import AppContainer from 'components/AppContainer'
import Header from 'components/common/Header'
import Card from 'components/common/Card'
import NetworkIcon from 'components/common/Icon/NetworkIcon'

import LoginWallets from './LoginWallets'

import styles from './styles.module.css'

const signingMessage = process.env.NEXT_PUBLIC_SIGNING_MESSAGE

const icons = 'eth|polygon|bnb|arb|opt|avax|zksync|aurora|tron|aptos|ftm|cronos|movr|beam|cfx'.split('|')

const loginOptions = {
  duration: 86400 * 7,
  onInfo: showInfoToast,
  onError: showErrorToast
}

export default function PageIndex() {
  const router = useRouter()
  const { extensions } = useExtensions()
  const { custodians } = useCustodians()
  const { login } = useWeb3Login(extensions, signingMessage, loginOptions)
  const { login: custodianLogin } = useWeb3Login(custodians, signingMessage, loginOptions)
  const [loading, setLoading] = React.useState(false)

  const onConnect = React.useCallback(async ext => {
    const account = ext?.isCustodian ? await custodianLogin(ext) : await login(ext)
    if (account?.token) {
      setLoading(true)
      api.postMyself(account.token)
        .then(async toList => {
          if (toList.length) {
            const to = toList[0]
            router.push(`/${to.key || to.handle}`)
          } else {
            setLoading(false)
          }
        })
        .catch(() => setLoading(false))
    }
  }, [router, login])

  return (
    <AppContainer className='sm:overflow-y-hidden'>
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
              Receive fund with certain network & stablecoins. Make transfers with any network & stablecoin you like, and let ALLsTo take care of cross-chain.
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
            <div className='text-2xl font-bold mb-2'>Create My Link</div>
            <div className='mb-5 font-light'>Choose the wallet you want to connect and customize your link.</div>
            <LoginWallets loading={loading} extensions={extensions} custodians={custodians.services} onConnect={onConnect} />
          </Card>
        </div>
      </div>
    </AppContainer>
  )
}
