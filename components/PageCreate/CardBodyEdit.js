import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import presets from '@mesonfi/presets'
import { useExtensions } from '@mesonfi/extensions/react'
import { useWeb3Login } from '@mesonfi/web3-jwt/react'

import * as api from 'lib/api'
import { disabledChains } from 'lib/extensions'
import { showInfoToast, showErrorToast } from 'lib/refs'

import Input from 'components/common/Input'
import Button from 'components/common/Button'
import NetworkIcon from 'components/common/Icon/NetworkIcon'

import iconLink from 'components/icons/link.svg'
import iconCopy from 'components/icons/copy.svg'
import iconCamera from 'components/icons/icon-camera.svg'
import { useDropzone } from 'react-dropzone'
import refs from 'lib/refs'

import TokenSelector from './TokenSelector'
import { utils as etherUtils } from 'ethers'
import classNames from 'classnames'

const signingMessage = process.env.NEXT_PUBLIC_SIGNING_MESSAGE
const BUCKET = process.env.NEXT_PUBLIC_AWS_BUCKET
const REGION = process.env.NEXT_PUBLIC_AWS_REGION

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
  const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#bdbdbd',
    borderRadius: '100%',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  }

  const acceptStyle = {
    borderColor: '#08B72F'
  }

  const rejectStyle = {
    borderColor: '#FF3838'
  }

  const [name, setName] = React.useState(to.name || '')
  const [desc, setDesc] = React.useState(to.desc || '')
  const [networkId, setNetworkId] = React.useState(to.networkId || '')
  const [tokens, setTokens] = React.useState(to.tokens)
  const extType = account?.iss?.split(':')[0]
  const [avatar, setAvatar] = React.useState(to.avatar)
  const [avatarFile, setAvatarFile] = React.useState()

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop: acceptedFiles => {
      setAvatar(URL.createObjectURL(acceptedFiles[0]))
      setAvatarFile(acceptedFiles[0])
      setModified(true)
    }
  })

  const style = React.useMemo(() => ({
    ...baseStyle,
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ])

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

  const updateAvatar = async (file) => {
    const folder = 'avatars'
    const ext = /[^.]+$/.exec(file.name)
    const key = `${folder}/${to.address}-${etherUtils.id(file.name)}.${ext}`
    const url = await api.getAWSPresignUrlByFileKey(account.token, key)

    const res = await window.fetch(url, {
      method: 'PUT',
      body: file
    })

    const publicUrl = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`
    if (res.status === 200) {
      setAvatar(publicUrl)
    }
  }

  const updateName = React.useCallback(v => {
    setName(v)
    setModified(true)
  }, [setModified])

  const updateDesc = React.useCallback(v => {
    setDesc(v)
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
    const data = { name, desc, networkId, tokens, avatar }
    try {
      if(avatarFile) {
        const toastId = refs.toast.current?.show({ title: 'Updating...', sticky: true, type: 'info' })
        await updateAvatar(avatarFile)
        refs.toast.current?.close(toastId)
      }
      const newTo = await api.updateRecipient(data, account.token)
      refs.toast.current?.show({ title: 'Saved!' })
      onSubmitted(newTo)
    } catch (e) {
      console.warn(e)
    }
  }, [name, desc, networkId, avatar, tokens, account.token, onSubmitted])


  if (!account?.sub) {
    return
  }

  return (
    <>
      <div {...getRootProps({ style })} className='mt-5 mb-1 self-center w-16 h-16 rounded-full border-2 border-white box-content relative overflow-hidden'>
        <Jazzicon seed={jsNumberForAddress(to.address)} diameter={64} />
        <div className={classNames('absolute top-0 left-0 w-full h-full hover:bg-primary/70 flex items-center justify-center cursor-pointer', avatar ? 'opacity-100' : 'opacity-0 hover:opacity-100')} >
          {
            !avatar && (<input  {...getInputProps()} />)
          }
          <Image fill='true' width={avatar ? '100%' : ''} height={avatar ? '100%' : ''} alt='' src={avatar || iconCamera} />
        </div>
      </div>

      <LinkInput to={to} accountToken={account.token} />

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
        value={desc}
        onChange={updateDesc}
        placeholder='Describe who you are'
        maxLength={100}
      >
        <div className='absolute bottom-[16px] right-4 text-primary/30 font-semibold'>
          {desc.length} / 100
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
          <div className='h-4 w-4'><Image fill='true' alt='' src={iconLink} /></div>
          <div className='ml-2 font-semibold text-gray-400'>https://alls.to/</div>
        </div>
        <div className='absolute top-[22px] h-[52px] right-2 flex items-center'>
          {
            uidClaimed || !inputUidValue
              ? <Button size='2xs' type='pure' className='!py-2' onClick={copyLink}>
                <div className='flex items-center justify-center h-4 w-4'>
                  <Image fill='true' alt='' src={iconCopy} />
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
