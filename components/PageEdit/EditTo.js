import React from 'react'
import { useRouter } from 'next/router'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import presets from '@mesonfi/presets'
import * as api from 'lib/api'

export default function EditTo ({ to, account }) {
  const router = useRouter()
  const [uid, setUid] = React.useState(to.uid || to.address)
  const [uidInput, setUidInput] = React.useState(to.uid || '')
  const [uidDisabled, setUidDisabled] = React.useState(!!to.uid)
  const [name, setName] = React.useState(to.name || '')
  const [desc, setDesc] = React.useState(to.desc || '')
  const [networkId, setNetworkId] = React.useState(to.networkId || '')
  const [tokens, setTokens] = React.useState(to.tokens || [])

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

  React.useEffect(() => {
    setTokens(ts => ts.filter(t => tokenList.find(({ symbol }) => symbol === t)))
  }, [tokenList])

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
      const data = { name, desc, networkId, tokens }
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
    <div className='flex flex-col mt-4 mb-12 w-[428px] border border-white rounded-2xl bg-white/75 backdrop-blur-md p-8 shadow-2xl'>
      <div className='self-center w-16 h-16 rounded-full'>
        <Jazzicon seed={jsNumberForAddress(to.address)} diameter={64} />
      </div>

      <div className='mt-2 self-center text-xs font-light text-[#0B2750]'>{to.address}</div>

      <div className='mt-5'>
        <label htmlFor='uid' className='text-xs font-light text-[#0B2750]'>
          Link
        </label>
        <input
          id='uid'
          name='uid'
          className='mt-1 w-full rounded-2xl bg-gray-100 p-4 text-base focus:outline-none text-base leading-none font-medium'
          value={uidInput}
          disabled={uidDisabled}
          onChange={evt => setUidInput(evt.target.value)}
          placeholder='You can setup an ID. Cannot change'
        />
      </div>

      <div className='mt-6'>
        <label htmlFor='name' className='text-xs font-light text-[#0B2750]'>
          Name
        </label>
        <input
          id='name'
          name='name'
          className='mt-1 w-full rounded-2xl bg-gray-100 p-4 text-base focus:outline-none text-base leading-none font-medium'
          value={name}
          onChange={evt => setName(evt.target.value)}
          placeholder='Enter your name'
        />
      </div>

      <div className='mt-6'>
        <label htmlFor='description' className='text-xs font-light text-[#0B2750]'>
          Description
        </label>
        <textarea
          id='description'
          name='description'
          className='block mt-1 w-full h-20 resize-none rounded-2xl bg-gray-100 p-4 text-base border-none focus:outline-none text-base leading-none font-medium'
          onChange={evt => setDesc(evt.target.value)}
          value={desc}
          placeholder='Describe who you are'
        />
      </div>

      <div className='mt-6'>
        <label htmlFor='chain' className='text-xs font-light text-[#0B2750]'>
          Chain
        </label>
        <select
          id='chain'
          name='chain'
          className='mt-1 w-full rounded-2xl bg-gray-100 p-4 text-base border-none focus:outline-none text-base leading-none font-medium'
          value={networkId}
          onChange={evt => setNetworkId(evt.target.value)}
        >
          {networks.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
        </select>
      </div>

      <div className='mt-6'>
        <label htmlFor='chain' className='text-xs font-light text-[#0B2750]'>
          Accept
        </label>
        <div className='ml-2 flex flex-col gap-1'>
          {tokenList.map(({ symbol, addr }) => (
            <label key={`token-${symbol}`}>
              <input
                type='checkbox'
                className='accent-indigo-500'
                checked={tokens.includes(symbol)}
                onChange={() => toggleToken(symbol)}
              /> {symbol} ({addr.substring(0, 6)}...)
            </label>
          ))}
        </div>
      </div>

      <div className='mt-6 flex flex-row gap-4'>
        <div className='flex-1'>
          <button
            className='w-full items-center rounded-xl h-12 text-base font-bold text-[#0B2750] border border-[#0B2750] bg-white focus:outline-none'
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
            className='flex w-full items-center justify-center rounded-xl h-12 text-base font-bold text-white bg-[#0B2750] focus:outline-none'
          >
            OPEN MY LINK
          </a>
        </div>
      </div>
    </div>
  )
}