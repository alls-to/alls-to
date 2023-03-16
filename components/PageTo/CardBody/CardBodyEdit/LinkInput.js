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

  const [key, setKey] = React.useState(to.handle)
  const [value, setValue] = React.useState(to.key ? to.handle : '')
  const [claimed, setClaimed] = React.useState(true) // !!to.key
  const [showClaim, setShowClaim] = React.useState(false)

  React.useImperativeHandle(ref, () => ({
    updateKey: key => {
      setKey(key)
      setValue(key)
      setClaimed(true)
      router.replace(`/${key}`)
    }
  }))

  const validator = React.useCallback(async key => {
    if (!key) {
      setShowClaim(false)
      return
    }
    setShowClaim(false)
    if (key.length < 4) {
      throw new Error('Length needs to be at least 4')
    }
    if (!/^[a-zA-Z0-9_-]{4,12}$/.exec(key)) {
      throw new Error('Only letters, numbers, "-" and "_" are accepted')
    }
    const result = await api.checkKey(key, accountToken)
    if (result) {
      throw new Error('Already exists')
    }
    setShowClaim(true)
    return 'Good choice!'
  }, [accountToken])

  const uidUnderline = React.useMemo(() => {
    if (claimed) {
      return ''
    } else if (!value) {
      return 'You can claim a customized link. Cannot change.'
    }
  }, [claimed, value])

  const copyLink = React.useCallback(() => {
    const link = `https://alls.to/${key}`
    navigator.clipboard.writeText(link)
    refs.toast.current?.show({ title: 'Link Copied!' })
  }, [key])

  const claim = React.useCallback(async () => {
    if (value) {
      await api.claimKey(value, accountToken)
      setKey(value)
      setClaimed(true)
      refs.toast.current?.show({ title: 'Link Claimed!' })
      router.replace(`/${value}`)
    }
  }, [router, value, accountToken])

  return (
    <div className=''>
      <Input
        id='uid'
        label={<>My Link{labelIcon}</>}
        inputClassName='pl-[144px]'
        value={value}
        onChange={setValue}
        validator={validator}
        disabled={claimed || !!to.did}
        placeholder={to.addr?.substring(0, 12)}
        maxLength={12}
        underline={uidUnderline}
      >
        <div className='absolute top-[22px] h-[52px] left-4 flex items-center'>
          <div className='h-4 w-4'><Icon type='link' /></div>
          <div className='ml-2 font-semibold text-gray-400'>https://alls.to/</div>
        </div>
        <div className='absolute top-[22px] h-[52px] right-2 flex items-center'>
        {
          claimed || !value
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
