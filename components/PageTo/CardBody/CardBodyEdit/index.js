import React from 'react'

import { useExtensions } from '@mesonfi/extensions/react'
import { useWeb3Login } from '@mesonfi/web3-jwt/react'

import * as api from 'lib/api'
import refs, { showInfoToast, showErrorToast } from 'lib/refs'

import Button from 'components/common/Button'

import BodyPartProfile from './BodyPartProfile'
import BodyPartReceive from './BodyPartReceive'

const signingMessage = process.env.NEXT_PUBLIC_SIGNING_MESSAGE

export default function CardBodyEdit({ to, setTo, setModified, onSubmitted }) {
  const { extensions, extStatus } = useExtensions()
  const { account, login } = useWeb3Login(extensions, signingMessage, {
    duration: 86400 * 7,
    onInfo: showInfoToast,
    onError: showErrorToast
  })

  React.useEffect(() => {
    if (!extStatus || extStatus.currentAccount?.address !== to.addr) {
      // TODO
      // Go back to my page on disconnect or changing address
      // onSubmitted()
    }
  }, [extStatus, to.addr, onSubmitted])

  React.useEffect(() => {
    if (!account) {
      return
    } else if (account.sub !== to.addr) {
      login(extensions.currentExt).catch(e => {
        onSubmitted()
      })
    }
  }, [account, to.addr, login, extensions, onSubmitted])

  if (!account) {
    return <CardBodyLoading />
  } else if (account.sub !== to.addr) {
    return <CardBodyLoading notice='Signing with wallet...' />
  }

  return (
    <CardBodyEditWithAccount
      to={to}
      setTo={setTo}
      setModified={setModified}
      onSubmitted={onSubmitted}
      account={account}
    />
  )
}

function CardBodyLoading({ notice = 'Loading...' }) {
  return (
    <div className='flex flex-col items-center h-[480px]'>
      <div className='mt-5 self-center w-16 h-16 rounded-full overflow-hidden border-2 border-white box-content'>
        <div className='w-16 h-16 bg-primary/10' />
      </div>

      <div className='mt-5 self-center'>
        {notice}
      </div>
    </div>
  )
}

function CardBodyEditWithAccount({ to, setTo, setModified, onSubmitted, account }) {
  const refProfile = React.useRef()
  const refReceive = React.useRef()

  const onModified = React.useCallback(updater => {
    if (updater) {
      setTo(updater)
    }
    setModified(true)
  }, [setTo, setModified])

  const onSave = React.useCallback(async () => {
    const profileData = refProfile.current?.getData()
    const receiveData = refReceive.current?.getData()
    const data = { ...profileData, ...receiveData }

    try {
      const newTo = await api.updateMyself(data, account.token)
      refs.toast.current?.show({ title: 'Saved!' })

      setTimeout(() => onSubmitted(newTo), 300)
    } catch (e) {
      console.warn(e)
    }
  }, [account.token, onSubmitted])

  if (!account?.sub) {
    return
  }

  return (
    <>
      <BodyPartProfile ref={refProfile} to={to} onModified={onModified} accountToken={account.token} />
      
      <div className='my-4' />
      <BodyPartReceive ref={refReceive} to={to} onModified={onModified} account={account} />

      <div className='mt-5'>
        <Button type='primary' onClick={onSave}>SAVE</Button>
      </div>
    </>
  )
}
