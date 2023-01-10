import React from 'react'
import Image from 'next/image'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import debounce from 'lodash/debounce'

import presets from '@mesonfi/presets'
import * as api from 'lib/api'
import { disabledChains } from 'lib/extensions'

import CentralCardWithSideInfo from 'components/common/Card/CentralCardWithSideInfo'
import Card from 'components/common/Card'
import Input from 'components/common/Input'
import Button from 'components/common/Button'
import NetworkIcon from 'components/common/Icon/NetworkIcon'

import iconCopy from 'components/icons/copy.svg'

import refs from 'lib/refs'

import TokenSelector from './TokenSelector'

export default function EditTo ({ switching, to, account }) {
  if (switching) {
    return <EditLoading notice='Switching address...' />
  } else if (!to) {
    return <EditLoading />
  } else {
    return <EditToLoaded to={to} account={account} />
  }
}

function EditLoading ({ notice = 'Loading...' }) {
  return (
    <CentralCardWithSideInfo networkId='polygon' token='usdc'>
      <Card bg='pos2' className='p-3 xs:p-4 md:p-6 h-[480px]'>
        <div className='flex flex-row justify-between'>
          <div className='font-semibold'>EDIT</div>
        </div>

        <div className='mt-5 self-center w-16 h-16 rounded-full overflow-hidden border-2 border-white box-content'>
          <div className='w-16 h-16 bg-primary/10' />
        </div>

        <div className='mt-5 self-center'>
          {notice}
        </div>
      </Card>
    </CentralCardWithSideInfo>
  )
}

function EditToLoaded ({ to, account }) {
  const [uid, setUid] = React.useState(to.uid || to.address.substring(0, 12))
  const [inputUidValue, setInputUidValue] = React.useState(to.uid || '')
  const [uidDisabled, setUidDisabled] = React.useState(!!to.uid)
  const [claimDisabled, setClaimDisabled] = React.useState(false)

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
      setClaimDisabled(true)
      return
    }
    setClaimDisabled(true)
    if (uid.length < 4) {
      throw new Error('Length needs to be at least 4')
    }
    if (!/^[a-zA-Z0-9._-]{4,12}$/.exec(uid)) {
      throw new Error('Only letters, numbers, and "." "-" "_" are accepted')
    }
    const result = await api.checkUid(uid, account.token)
    if (result) {
      throw new Error('Already exists')
    }
    setClaimDisabled(false)
    return 'Good choice!'
  }, [account.token])

  const uidUnderline = React.useMemo(() => {
    if (uidDisabled) {
      return ''
    } else if (!inputUidValue) {
      return 'You can claim a customized ID. Cannot change.'
    }
  }, [uidDisabled, inputUidValue])

  const copyLink = React.useCallback(() => {
    const link = `https://alls.to/${uid}`
    navigator.clipboard.writeText(link)
    refs.toast.current?.show({ title: 'Link Copied!' })
  }, [uid])

  const claim = React.useCallback(async () => {
    if (inputUidValue) {
      await api.claimUid(inputUidValue, account.token)
      setUid(inputUidValue)
      setUidDisabled(true)
      setInputUidValue()
      refs.toast.current?.show({ title: 'Link Claimed!' })
    }
  }, [account.token, inputUidValue])

  const [name, setName] = React.useState(to.name || '')
  const [desc, setDesc] = React.useState(to.desc || '')
  const [networkId, setNetworkId] = React.useState(to.networkId || '')
  const [tokens, setTokens] = React.useState(to.tokens)

  const autoSave = React.useMemo(() => debounce(async data => {
    try {
      await api.updateRecipient(data, account.token)
      refs.toast.current?.show({ title: 'Change auto-saved!' })
    } catch (e) {
      console.warn(e)
    }
  }, 2000), [account.token])

  const updateName = name => {
    setName(name)
    autoSave({ name, desc, networkId, tokens })
  }

  const updateDesc = desc => {
    setDesc(desc)
    autoSave({ name, desc, networkId, tokens })
  }

  const updateNetworkId = networkId => {
    setNetworkId(networkId)
    autoSave({ name, desc, networkId, tokens })
  }

  const updateTokens = tokens => {
    setTokens(tokens)
    autoSave({ name, desc, networkId, tokens })
  }

  if (!account?.sub) {
    return
  }

  return (
    <CentralCardWithSideInfo networkId={networkId} token={tokens[0]}>
      <Card bg='pos2' className='p-3 xs:p-4 md:p-6'>
        <div className='flex flex-row justify-between'>
          <div className='font-semibold'>EDIT</div>
        </div>

        <div className='mt-5 mb-4 self-center w-16 h-16 rounded-full border-2 border-white box-content'>
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
          <div className='absolute top-[22px] right-2.5 flex items-center h-[52px]'>
          {
            !inputUidValue
            ? <Button size='sm' type='pure' className='!px-2' onClick={copyLink}>
                <div className='flex items-center justify-center h-4 w-4'>
                  <Image fill='true' alt='' src={iconCopy} />
                </div>
              </Button>
            : !claimDisabled &&
              <Button size='xs' type='primary' className='!px-2 !py-1 !text-sm' onClick={claim}>
                CLAIM
              </Button>
          }
          </div>
        </Input>

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
          <Button
            className='flex-1'
            type='primary'
            as='a'
            href={`/${uid}`}
            target='_blank'
          >
            OPEN MY LINK
          </Button>
        </div>
      </Card>
    </CentralCardWithSideInfo>

  )
}