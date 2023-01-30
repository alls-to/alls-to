import React from 'react'
import { useRouter } from 'next/router'

import * as api from 'lib/api'
import refs from 'lib/refs'

import Input from 'components/common/Input'
import Button from 'components/common/Button'
import Icon from 'components/icons'

export default React.forwardRef(LinkInput)

function LinkInput({ to, labelIcon, accountToken }, ref) {
  const router = useRouter()

  const [uid, setUid] = React.useState(to.uid || to.address?.substring(0, 12))
  const [inputUidValue, setInputUidValue] = React.useState(to.uid || '')
  const [uidClaimed, setUidClaimed] = React.useState(true) // !!to.uid
  const [showClaim, setShowClaim] = React.useState(false)

  React.useImperativeHandle(ref, () => ({
    updateUid: uid => {
      setUid(uid)
      setInputUidValue(uid)
      setUidClaimed(true)
      router.replace(`/${uid}`)
    }
  }))

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
        label={<>My Link{labelIcon}</>}
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
