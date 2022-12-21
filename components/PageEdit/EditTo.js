import React from 'react'
import { useRouter } from 'next/router'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import presets from '@mesonfi/presets'
import * as api from 'lib/api'

import Card from 'components/common/Card'
import Input from 'components/common/Input'
import TokenSelector from 'components/common/TokenSelector'
import Button from 'components/common/Button'

export default function EditTo ({ to, account }) {
  const router = useRouter()
  const [uid, setUid] = React.useState(to.uid || to.address)
  const [uidInput, setUidInput] = React.useState(to.uid || '')
  const [uidDisabled, setUidDisabled] = React.useState(!!to.uid)
  const [name, setName] = React.useState(to.name || '')
  const [desc, setDesc] = React.useState(to.desc || '')
  const [networkId, setNetworkId] = React.useState(to.networkId || '')
  const [tokens, setTokens] = React.useState(to.tokens || ['usdc', 'usdt', 'busd'])

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

  if (!account?.sub) {
    return
  }

  const toggleToken = token => {
    if (tokens.includes(token)) {
      setTokens(tokens.filter(t => t !== token))
    } else {
      setTokens([...tokens, token])
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
        className='mt-4'
        inputClassName='pl-[121px]'
        label='My Link'
        value={uidInput}
        onChange={setUidInput}
        disabled={uidDisabled}
        placeholder='my_customized_id'
        underline={!uidDisabled && 'You can setup a customized ID once. Cannot change.'}
      >
        <div className='absolute top-[38px] left-4 font-semibold text-gray-400'>https://alls.to/</div>
      </Input>

      <Input
        id='name'
        className='mt-5'
        label='Name'
        value={name}
        onChange={setName}
        placeholder='Enter your name'
      />

      <Input
        id='description'
        className='mt-5'
        type='textarea'
        label='Description'
        value={desc}
        onChange={setDesc}
        placeholder='Describe who you are'
      />

      <Input
        id='chain'
        className='mt-5'
        type='select'
        label='Receive Stablecoins as'
        value={networkId}
        onChange={setNetworkId}
        options={networks}
      />

      <div className='mt-3 flex flex-row gap-3'>
        {tokenList.map(({ symbol, addr }) => (
          <TokenSelector
            key={`token-${symbol}`}
            symbol={symbol}
            selected={tokens.includes(symbol)}
            onToggle={toggleToken}
          />
        ))}
      </div>

      <div className='mt-6 flex flex-row gap-4'>
        <div className='flex-1'>
          <Button onClick={saveChange}>{btn}</Button>
        </div>
        <div className='flex-1'>
          <Button
            as='a'
            type='primary'
            href={`/${uid}`}
            target='_blank'
            rel='noreferrer'
          >OPEN MY LINK</Button>
        </div>
      </div>
    </Card>
  )
}