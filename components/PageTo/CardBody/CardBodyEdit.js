import React from 'react'
import { useRouter } from 'next/router'

import presets from '@mesonfi/presets'
import { useExtensions } from '@mesonfi/extensions/react'
import { useWeb3Login } from '@mesonfi/web3-jwt/react'

import * as api from 'lib/api'
import { disabledChains } from 'lib/extensions'
import refs, { showInfoToast, showErrorToast } from 'lib/refs'

import Input from 'components/common/Input'
import Button from 'components/common/Button'
import NetworkIcon from 'components/common/Icon/NetworkIcon'
import Icon from 'components/icons'

import SocialButtons from './SocialButtons'
import TokenSelector from './TokenSelector'
import AvatarUploader from './Avatar/AvatarUploader'

const signingMessage = process.env.NEXT_PUBLIC_SIGNING_MESSAGE

export default function CardBodyEdit({ to, setTo, setModified, onSubmitted }) {
  const { extensions } = useExtensions()
  const { account, login } = useWeb3Login(extensions, signingMessage, {
    duration: 86400 * 7,
    onInfo: showInfoToast,
    onError: showErrorToast
  })

  React.useEffect(() => {
    if (!account) {
      return
    } else if (!account.token) {
      extensions.connect()
        .then(() => login(extensions.currentExt))
        .catch(e => {
          onSubmitted()
        })
      return
    }
  }, [account, login, extensions, onSubmitted])

  if (!account) {
    return <CardBodyLoading />
  } else if (!account?.sub) {
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
  const [avatar, setAvatar] = React.useState(to.avatar || '')
  const [name, setName] = React.useState(to.name || '')
  const [bio, setBio] = React.useState(to.bio || '')
  const [networkId, setNetworkId] = React.useState(to.networkId || '')
  const [tokens, setTokens] = React.useState(to.tokens)
  const extType = account?.iss?.split(':')[0]

  const networks = React.useMemo(() => {
    if (!extType) {
      return []
    }
    return presets.getAllNetworks()
      .filter(n => !disabledChains.includes(n.id))
      .filter(n => n.extensions.includes(extType))
  }, [extType])

  const defaultNetworkId = !networkId && networks[0]?.id
  React.useEffect(() => {
    if (defaultNetworkId) {
      setNetworkId(defaultNetworkId)
      setTo(to => ({ ...to, networkId: defaultNetworkId }))
    }
  }, [defaultNetworkId, setTo])

  const updateAvatar = v => {
    setAvatar(v)
    setTimeout(() => {
      onSave()
    }, 100)
  }

  const updateName = React.useCallback(v => {
    setName(v)
    setModified(true)
  }, [setModified])

  const updateBio = React.useCallback(v => {
    setBio(v)
    setModified(true)
  }, [setModified])

  const updateNetworkId = React.useCallback(networkId => {
    setNetworkId(networkId)
    setTo(to => ({ ...to, networkId }))
    setModified(true)
  }, [setTo, setModified])

  const updateTokens = React.useCallback(tokens => {
    setTokens(tokens)
    setTo(to => ({ ...to, tokens }))
    setModified(true)
  }, [setTo, setModified])

  const onSave = React.useCallback(async () => {
    const data = { avatar, name, bio, networkId, tokens }

    try {
      const newTo = await api.updateRecipient(data, account.token)
      refs.toast.current?.show({ title: 'Saved!' })

      setTimeout(() => onSubmitted(newTo), 300)
    } catch (e) {
      console.warn(e)
    }
  }, [avatar, name, bio, networkId, tokens, account.token, onSubmitted])

  if (!account?.sub) {
    return
  }

  return (
    <>
      <AvatarUploader
        address={to.address}
        current={avatar}
        onUploaded={updateAvatar}
        token={account.token}
      />
      
      <div className='mt-3 self-center'>
        <SocialButtons socials={to.socials} />
      </div>

      <div className='mt-3'>
        <LinkInput to={to} accountToken={account.token} />
      </div>

      <Input
        id='name'
        className='mt-5'
        label='Name'
        value={name}
        onChange={updateName}
        placeholder='Enter your name'
        maxLength={24}
      >
        <div className='absolute bottom-[16px] right-4 text-primary/30 font-semibold'>
          {name.length} / 24
        </div>
      </Input>

      <Input
        id='bio'
        className='mt-5'
        inputClassName='pb-[28px]'
        type='textarea'
        label='Bio'
        value={bio}
        onChange={updateBio}
        placeholder='Describe who you are'
        maxLength={100}
      >
        <div className='absolute bottom-[16px] right-4 text-primary/30 font-semibold'>
          {bio.length} / 100
        </div>
      </Input>

      <Input
        id='chain'
        className='mt-5 mb-3'
        inputClassName='pl-11'
        type='select'
        label='Receive Stablecoins as'
        value={networkId}
        onChange={updateNetworkId}
        options={networks}
      >
        <div className='absolute left-4 bottom-[10px]'>
          <NetworkIcon size={22} id={networkId} />
        </div>
      </Input>

      <TokenSelector
        networkId={networkId}
        tokens={tokens}
        onChange={updateTokens}
      />

      <div className='mt-5'>
        <Button type='primary' onClick={onSave}>
          SAVE
        </Button>
      </div>
    </>
  )
}

function LinkInput({ to, accountToken }) {
  const router = useRouter()

  const [uid, setUid] = React.useState(to.uid || to.address?.substring(0, 12))
  const [inputUidValue, setInputUidValue] = React.useState(to.uid || '')
  const [uidClaimed, setUidClaimed] = React.useState(!!to.uid)
  const [showClaim, setShowClaim] = React.useState(false)

  const uidValidator = React.useCallback(async uid => {
    if (!uid) {
      setShowClaim(false)
      return
    }
    setShowClaim(false)
    if (uid.length < 4) {
      throw new Error('Length needs to be at least 4')
    }
    if (!/^[a-zA-Z0-9._-]{4,12}$/.exec(uid)) {
      throw new Error('Only letters, numbers, and "." "-" "_" are accepted')
    }
    const result = await api.checkUid(uid, accountToken)
    if (result) {
      throw new Error('Already exists')
    }
    setShowClaim(true)
    return 'Good choice!'
  }, [accountToken])

  const uidUnderline = React.useMemo(() => {
    if (uidClaimed) {
      return ''
    } else if (!inputUidValue) {
      return 'You can claim a customized link. Cannot change.'
    }
  }, [uidClaimed, inputUidValue])

  const copyLink = React.useCallback(() => {
    const link = `https://alls.to/${uid}`
    navigator.clipboard.writeText(link)
    refs.toast.current?.show({ title: 'Link Copied!' })
  }, [uid])

  const claim = React.useCallback(async () => {
    if (inputUidValue) {
      await api.claimUid(inputUidValue, accountToken)
      setUid(inputUidValue)
      setUidClaimed(true)
      refs.toast.current?.show({ title: 'Link Claimed!' })
      router.replace(`/${inputUidValue}`)
    }
  }, [router, inputUidValue, accountToken])

  return (
    <div className=''>
      <Input
        id='uid'
        label='My Link'
        inputClassName='pl-[144px]'
        value={inputUidValue}
        onChange={setInputUidValue}
        validator={uidValidator}
        disabled={uidClaimed}
        placeholder={to.address?.substring(0, 12)}
        maxLength={12}
        underline={uidUnderline}
      >
        <div className='absolute top-[22px] h-[52px] left-4 flex items-center'>
          <div className='h-4 w-4'><Icon type='link' /></div>
          <div className='ml-2 font-semibold text-gray-400'>https://alls.to/</div>
        </div>
        <div className='absolute top-[22px] h-[52px] right-2 flex items-center'>
          {
            uidClaimed || !inputUidValue
              ? <Button size='2xs' type='pure' className='!py-2' onClick={copyLink}>
                <div className='flex items-center justify-center h-4 w-4'>
                  <Icon type='copy' />
                </div>
              </Button>
              : showClaim &&
              <Button size='2xs' type='primary' onClick={claim}>
                CLAIM
              </Button>
          }
        </div>
      </Input>
    </div>
  )
}
