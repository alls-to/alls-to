import React from 'react'
import { useRouter } from 'next/router'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import difference from 'lodash/difference'

import presets from '@mesonfi/presets'
import * as api from 'lib/api'

import Card from 'components/common/Card'
import Input from 'components/common/Input'
import Button from 'components/common/Button'
import TokenSelector from 'components/common/TokenSelector'
import NetworkIcon from 'components/common/Icon/NetworkIcon'

export default function EditTo ({ to, account }) {
  const router = useRouter()
  const [uid, setUid] = React.useState(to.uid || to.address)
  const [uidInput, setUidInput] = React.useState(to.uid || '')
  const [uidDisabled, setUidDisabled] = React.useState(!!to.uid)
  const [name, setName] = React.useState(to.name || '')
  const [desc, setDesc] = React.useState(to.desc || '')
  const [networkId, setNetworkId] = React.useState(to.networkId || '')
  const [tokens, setTokens] = React.useState(to.tokens || [to.networkId === 'tron' ? 'usdt' : 'usdc'])

  const [btn, setBtn] = React.useState('SAVE')

  const extType = account?.iss?.split(':')[0]

  const networks = React.useMemo(() => {
    if (!extType) {
      return []
    }
    return presets.getAllNetworks().filter(n => n.extensions.includes(extType))
  }, [extType])

  const defaultNetworkId = !networkId && networks[0]?.id
  React.useEffect(() => {
    if (defaultNetworkId) {
      setNetworkId(defaultNetworkId)
    }
  }, [defaultNetworkId])

  const tokenList = React.useMemo(() => {
    if (!networkId) {
      return []
    }
    return presets.getTokensForNetwork(networkId)
      .filter(t => t.tokenIndex < 255)
      .map(t => ({ symbol: t.symbol.split('.')[0].toLowerCase(), addr: t.addr }))
  }, [networkId])

  const unsupportedTokens = React.useMemo(() => {
    return difference(['usdc', 'usdt', 'busd'], tokenList.map(({ symbol }) => symbol))
  }, [tokenList])

  React.useEffect(() => {
    if (unsupportedTokens.includes(tokens[0])) {
      setTokens(['usdc'])
    }
  }, [unsupportedTokens])

  if (!account?.sub) {
    return
  }

  const toggleToken = token => {
    if (tokens.includes(token)) {
      // setTokens(tokens.filter(t => t !== token))
    } else {
      setTokens([token])
      // setTokens([...tokens, token])
    }
  }

  const saveChange = async () => {
    if (!tokens.length) {
      window.alert('Please select at least one token')
      return
    }

    try {
      setBtn('SAVING...')
      const data = { name, desc, networkId }
      data.tokens = tokens.filter(t => tokenList.find(({ symbol }) => symbol === t))
      if (uidInput && !uidDisabled) {
        data.uid = uidInput
      }
      await api.updateRecipient(data, account.token)
      if (uidInput) {
        setUid(uidInput)
        setUidDisabled(uidInput)
        router.replace(`/edit/${uidInput}`)
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
    <Card bg='pos2'>
      <div className='self-center w-16 h-16 rounded-full border-2 border-white box-content'>
        <Jazzicon seed={jsNumberForAddress(to.address)} diameter={64} />
      </div>

      <Input
        id='uid'
        inputClassName='pl-[121px]'
        label='My Link'
        value={uidInput}
        onChange={setUidInput}
        disabled={uidDisabled}
        placeholder='my_customize_id'
        maxLength={12}
        underline={!uidDisabled && 'You can setup a customized ID once. Cannot change.'}
      >
        <div className='absolute top-[38px] left-4 font-semibold text-gray-400'>https://alls.to/</div>
        <div className='absolute top-[30px] right-2'>
          <Button
            as='a'
            size='sm'
            type='pure'
            className='text-base font-semibold px-2'
            href={`/${uid}`}
            target='_blank'
            rel='noreferrer'
          >OPEN</Button>
        </div>
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
        <div className='absolute bottom-[15px] right-4 text-primary/30 font-semibold'>
          {name.length} / 24
        </div>
      </Input>

      <Input
        id='description'
        className='mt-5'
        inputClassName='pb-8'
        type='textarea'
        label='Description'
        value={desc}
        onChange={setDesc}
        placeholder='Describe who you are'
        maxLength={100}
      >
        <div className='absolute bottom-[15px] right-4 text-primary/30 font-semibold'>
          {desc.length} / 100
        </div>
      </Input>

      <Input
        id='chain'
        className='mt-5'
        inputClassName='pl-11'
        type='select'
        label='Receive Stablecoins as'
        value={networkId}
        onChange={setNetworkId}
        options={networks}
      >
        <div className='absolute left-4 bottom-[10px]'>
          <NetworkIcon id={networkId} />
        </div>
      </Input>

      <div className='mt-3 flex flex-row gap-3'>
        {['usdc', 'usdt', 'busd'].map(t => (
          <TokenSelector
            key={`token-${t}`}
            symbol={t}
            selected={tokens.includes(t)}
            onToggle={toggleToken}
            disabled={!tokenList.find(({ symbol }) => symbol === t)}
          />
        ))}
      </div>

      <div className='mt-1 text-xs text-primary/50'>
        {unsupportedTokens.length ? 'Some stablecoins are not supported on this network.' : ''}
      </div>

      <div className='mt-5 flex flex-row gap-4'>
        <div className='flex-1'>
          <Button onClick={saveChange}>{btn}</Button>
        </div>
      </div>
    </Card>
  )
}