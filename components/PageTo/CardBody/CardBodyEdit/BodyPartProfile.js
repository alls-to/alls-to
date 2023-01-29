import React from 'react'
import { useRouter } from 'next/router'

import * as api from 'lib/api'
import refs from 'lib/refs'

import Input from 'components/common/Input'
import Button from 'components/common/Button'
import Icon from 'components/icons'

import SocialButtons from '../SocialButtons'
import AvatarWrapper from '../Avatar/AvatarWrapper'
import AvatarUploader from '../Avatar/AvatarUploader'

export default React.forwardRef(BodyPartProfile)

function BodyPartProfile({ to, onModified, accountToken }, ref) {
  const [avatar, setAvatar] = React.useState(to.avatar || '')
  const [name, setName] = React.useState(to.name || '')
  const [bio, setBio] = React.useState(to.bio || '')

  React.useImperativeHandle(ref, () => ({
    getData: () => ({ avatar, name, bio })
  }))

  const updateAvatar = React.useCallback(v => {
    setAvatar(v)
    onModified()
  }, [onModified])

  const updateName = React.useCallback(v => {
    setName(v)
    onModified()
  }, [onModified])

  const updateBio = React.useCallback(v => {
    setBio(v)
    onModified()
  }, [onModified])

  return (
    <>
      <div className='mt-5 self-center'>
        <AvatarWrapper badge={{ type: to.did, href: `https://link3.to/${to.uid}` }}>
          <AvatarUploader
            address={to.address}
            current={avatar}
            onUploaded={updateAvatar}
            disabled={!!to.did}
            accountToken={accountToken}
          />
        </AvatarWrapper>
      </div>

      <div className='mt-3'>
        <LinkInput to={to} accountToken={accountToken} />
      </div>

      <Input
        id='name'
        className='mt-5'
        label='Name'
        value={name}
        onChange={updateName}
        disabled={!!to.did}
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
        disabled={!!to.did}
        placeholder='Describe who you are'
        maxLength={100}
      >
        <div className='absolute bottom-[16px] right-4 text-primary/30 font-semibold'>
          {bio.length} / 100
        </div>
      </Input>

      <div className='mt-3'>
        <SocialButtons socials={to.socials} />
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
        disabled={uidClaimed || !!to.did}
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
