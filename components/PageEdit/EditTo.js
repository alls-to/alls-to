import React from 'react'
import { useRouter } from 'next/router'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import presets from '@mesonfi/presets'
import * as api from 'lib/api'

import CentralCardWithSideInfo from 'components/common/Card/CentralCardWithSideInfo'
import Card from 'components/common/Card'
import Input from 'components/common/Input'
import Button from 'components/common/Button'
import NetworkIcon from 'components/common/Icon/NetworkIcon'

import TokenSelector from './TokenSelector'

const disabledChains = (process.env.NEXT_PUBLIC_DISABLED_CHAINS || '').split(',')

export default function EditTo ({ to, account }) {
  const router = useRouter()
  const [uid, setUid] = React.useState(to.uid || to.address.substring(0, 12))
  const [inputUidValue, setInputUidValue] = React.useState(to.uid || '')
  const [uidDisabled, setUidDisabled] = React.useState(!!to.uid)
  const [name, setName] = React.useState(to.name || '')
  const [desc, setDesc] = React.useState(to.desc || '')
  const [networkId, setNetworkId] = React.useState(to.networkId || '')
  const [tokens, setTokens] = React.useState(to.tokens)

  const [btn, setBtn] = React.useState('SAVE')
  const [btnDisabled, setBtnDisabled] = React.useState(false)

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
    }
  }, [defaultNetworkId])

  const uidValidator = React.useCallback(async uid => {
    if (!uid) {
      setBtnDisabled(false)
      return
    }
    setBtnDisabled(true)
    if (uid.length < 4) {
      throw new Error('Length needs to be at least 4')
    }
    if (!/^[a-zA-Z0-9._-]{4,12}$/.exec(uid)) {
      throw new Error('Only letters, numbers, and "." "-" "_" are accepted')
    }
    const result = await api.checkRecipient(uid, account.token)
    if (result) {
      throw new Error('Already exists')
    }
    setBtnDisabled(false)
    return 'Good!'
  }, [account.token])

  const uidUnderline = React.useMemo(() => {
    if (uidDisabled) {
      return ''
    } else if (!inputUidValue) {
      return 'You can setup a customized ID once. Cannot change.'
    }
  }, [uidDisabled, inputUidValue])

  if (!account?.sub) {
    return
  }

  const saveChange = async () => {
    if (!tokens.length) {
      window.alert('Please select at least one token')
      return
    }

    try {
      setBtn('SAVING...')
      const data = { name, desc, networkId, tokens }
      if (inputUidValue && !uidDisabled) {
        data.uid = inputUidValue
      }
      await api.updateRecipient(data, account.token)
      if (inputUidValue) {
        setUid(inputUidValue)
        setUidDisabled(inputUidValue)
        router.replace(`/edit/${inputUidValue}`)
      }
      setBtn('SAVED!')
      setTimeout(() => setBtn('SAVE'), 1000)
    } catch (e) {
      if (e.code === 409) {
        // setUid(to.uid)
      }
      console.warn(e)
      setBtn('SAVE')
    }
  }

  return (
    <CentralCardWithSideInfo networkId={networkId} token={tokens[0]}>
      <Card bg='pos2' className='p-3 xs:p-4 md:p-6'>
        <div className='flex flex-row justify-between'>
          <div className='font-semibold'>EDIT</div>
        </div>

        <div className='mt-5 self-center w-16 h-16 rounded-full border-2 border-white box-content'>
          <Jazzicon seed={jsNumberForAddress(to.address)} diameter={64} />
        </div>

        <Input
          id='uid'
          inputClassName='pl-[121px]'
          label='My Link'
          value={inputUidValue}
          onChange={setInputUidValue}
          validator={uidValidator}
          disabled={uidDisabled}
          placeholder={to.address.substring(0, 12)}
          maxLength={12}
          underline={uidUnderline}
        >
          <div className='absolute top-[39px] left-4 font-semibold text-gray-400'>https://alls.to/</div>
          {
            (!inputUidValue || uidDisabled) &&
            <div className='absolute top-[33px] right-2'>
              <Button
                as='a'
                size='xs'
                type='primary'
                className='!text-sm !px-2 !py-0.5'
                href={`/${uid}`}
                target='_blank'
                rel='noreferrer'
              >OPEN</Button>
            </div>
          }
        </Input>

        <Input
          id='name'
          className='mt-5'
          label='Name'
          value={name}
          onChange={setName}
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
          onChange={setDesc}
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
          onChange={setNetworkId}
          options={networks}
        >
          <div className='absolute left-4 bottom-[10px]'>
            <NetworkIcon size={22} id={networkId} />
          </div>
        </Input>

        <TokenSelector
          networkId={networkId}
          tokens={tokens}
          onChange={setTokens}
        />

        <div className='mt-5'>
          <Button onClick={saveChange} disabled={btnDisabled}>{btn}</Button>
        </div>
      </Card>
    </CentralCardWithSideInfo>

  )
}