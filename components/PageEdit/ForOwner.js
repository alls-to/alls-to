import React from 'react'

import presets from '@mesonfi/presets'

export default function ForOwner ({ to, extensions, account }) {
  const [id, setId] = React.useState('phil')

  const [name, setName] = React.useState('')
  const [desc, setDesc] = React.useState('')
  const [networkId, setNetworkId] = React.useState('')
  const [tokens, setTokens] = React.useState(to.tokens || [])
  const [btn, setBtn] = React.useState('Save')

  const extType = account?.iss?.split(':')[0]

  const networks = React.useMemo(() => {
    if (!extType) {
      return []
    }
    return presets.getAllNetworks().filter(n => n.extensions.includes(extType))
  }, [extType])

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
      const message = [
        `Sign this message to update my receiving config`,
        `Chain: ${presets.getNetwork(networkId).name}`,
        `Tokens: ${tokens.join(',').toUpperCase()}`,
        '',
        `My address: ${to.address}`
      ].join('\n')
      const signature = await extensions.signMessage(message)

      setBtn('Saving...')
      const res = await fetch(`/api/v1/recipient/${to.address}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature })
      })
      const result = await res.json()
      setBtn('Saved!')
      setTimeout(() => setBtn('Save'), 2000)

      if (!result.error) {
        // onUpdated(result.result)
      }
    } catch (e) {
      console.warn(e)
      setBtn('Save')
    }
  }

  return (
    <div className='flex flex-col mt-6'>

      <a href={`https://alls.to/${id}`} target='_blank' rel="noreferrer" className='text-indigo-600 hover:text-indigo-800 hover:underline'>
        https://alls.to/{id}
      </a>

      <b>Edit</b>

      <div>Avatar</div>

      <div>
        <label htmlFor='id' className='block text-sm font-medium text-gray-700'>
          Alls.to ID
        </label>
        <input
          id='id'
          name='id'
          className='mt-1 w-64 block w-full rounded-md border border-gray-300 py-1 pl-3 pr-1 text-base focus:outline-none sm:text-sm'
          value={id}
          onChange={evt => setId(evt.target.value)}
          placeholder='Enter your ID'
        />
      </div>

      <div>
        <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
          Name
        </label>
        <input
          id='name'
          name='name'
          className='mt-1 w-64 block w-full rounded-md border border-gray-300 py-1 pl-3 pr-1 text-base focus:outline-none sm:text-sm'
          value={name}
          onChange={evt => setName(evt.target.value)}
          placeholder='Enter your name'
        />
      </div>

      <div>
        <label htmlFor='description' className='block text-sm font-medium text-gray-700'>
          Description
        </label>
        <textarea
          id='description'
          name='description'
          className='mt-1 w-64 block w-full rounded-md border border-gray-300 py-1 pl-3 pr-1 text-base focus:outline-none sm:text-sm'
          onChange={evt => setDesc(evt.target.value)}
          value={desc}
          placeholder='Describe who you are'
        />
      </div>

      <div>
        <label htmlFor='chain' className='block text-sm font-medium text-gray-700'>
          Chain
        </label>
        <select
          id='chain'
          name='chain'
          className='mt-1 w-64 block w-full rounded-md border-gray-300 py-1 pl-3 pr-1 text-base focus:outline-none sm:text-sm'
          value={networkId}
          onChange={async evt => {
            await extensions.switch(evt.target.value)
          }}
        >
          {networks.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
        </select>
      </div>

      <div className='flex flex-col'>
        Accept:
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

      <button
        className='items-center rounded-md px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none'
        onClick={saveChange}
      >
        {btn}
      </button>
    </div>
  )
}