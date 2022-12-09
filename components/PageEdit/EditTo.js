import React from 'react'
import { useRouter } from 'next/router'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import presets from '@mesonfi/presets'
import * as api from 'lib/api'

import Card from 'components/common/Card'
import TokenSelector from 'components/common/TokenSelector'

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
    <Card bg='pos2' className='mt-4 mb-12 w-[428px]'>
      <div className='self-center w-16 h-16 rounded-full border-2 border-white box-content'>
        <Jazzicon seed={jsNumberForAddress(to.address)} diameter={64} />
      </div>

      <div className='mt-4 relative text-sm'>
        <label htmlFor='uid' className='text-[#0B2750]'>
          My Link
        </label>
        <input
          id='uid'
          name='uid'
          className='mt-1 w-full rounded-2xl bg-glass-200 placeholder-gray-300 p-4 font-semibold pl-[120px] border-none focus:outline-none'
          value={uidInput}
          disabled={uidDisabled}
          onChange={evt => setUidInput(evt.target.value)}
          placeholder='my_id'
        />
        <div className='absolute top-[38px] left-4 font-semibold text-gray-400'>https://alls.to/</div>
        {!uidDisabled && <div className='ml-4 mt-1 text-xs text-[#0B2750]'>You can setup an ID. Cannot change.</div>}
      </div>

      <div className='mt-5 text-sm'>
        <label htmlFor='name' className='text-[#0B2750]'>
          Name
        </label>
        <input
          id='name'
          name='name'
          className='mt-1 w-full rounded-2xl bg-glass-200 p-4 font-semibold border-none focus:outline-none'
          value={name}
          onChange={evt => setName(evt.target.value)}
          placeholder='Enter your name'
        />
      </div>

      <div className='mt-5 text-sm'>
        <label htmlFor='description' className='text-[#0B2750]'>
          Description
        </label>
        <textarea
          id='description'
          name='description'
          className='block mt-1 w-full h-20 resize-none rounded-2xl bg-glass-200 p-4 font-semibold border-none focus:outline-none '
          onChange={evt => setDesc(evt.target.value)}
          value={desc}
          placeholder='Describe who you are'
        />
      </div>

      <div className='mt-5 text-sm'>
        <label htmlFor='chain' className='text-[#0B2750]'>
          Receive Stablecoins as
        </label>
        <select
          id='chain'
          name='chain'
          className='mt-1 w-full rounded-2xl bg-glass-200 p-4 text-sm font-semibold border-none focus:outline-none'
          value={networkId}
          onChange={evt => setNetworkId(evt.target.value)}
        >
          {networks.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
        </select>
      </div>

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
          <button
            className='w-full items-center rounded-xl h-12 font-semibold text-[#0B2750] border border-[#0B2750] bg-white focus:outline-none'
            onClick={saveChange}
          >
            {btn}
          </button>
        </div>
        <div className='flex-1'>
          <a
            href={`/${uid}`}
            target='_blank'
            rel='noreferrer'
            className='flex w-full items-center justify-center rounded-xl h-12 font-semibold text-white bg-[#0B2750] focus:outline-none'
          >
            OPEN MY LINK
          </a>
        </div>
      </div>
    </Card>
  )
}