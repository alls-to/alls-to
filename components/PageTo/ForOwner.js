import React from 'react'

import presets from '@mesonfi/presets'
import extensions from '@mesonfi/extensions'

const networks = presets.getAllNetworks()

export default function ForOwner ({ to, onUpdated }) {
  const [chain, setChain] = React.useState(to.chain)
  const [tokens, setTokens] = React.useState(to.tokens || [])
  const [btn, setBtn] = React.useState('Save')

  const tokenList = React.useMemo(() => {
    return presets.getTokensForNetwork(chain)
      .filter(t => t.tokenIndex < 255)
      .map(t => ({ symbol: t.symbol.split('.')[0].toLowerCase(), addr: t.addr }))
  }, [chain])

  React.useEffect(() => {
    setTokens(ts => ts.filter(t => tokenList.find(({ symbol }) => symbol === t)))
  }, [tokenList])

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
        `Chain: ${presets.getNetwork(chain).name}`,
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
        onUpdated(result.result)
      }
    } catch (e) {
      console.warn(e)
      setBtn('Save')
    }
  }

  return (
    <div className='flex flex-col mt-6'>
      <b>Edit</b>

      <div>
        <label htmlFor='chain' className='block text-sm font-medium text-gray-700'>
          Chain
        </label>
        <select
          id='chain'
          name='chain'
          className='mt-1 block w-full rounded-md border-gray-300 py-1 pl-3 pr-1 text-base focus:outline-none sm:text-sm'
          value={chain}
          onChange={evt => setChain(evt.target.value)}
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
              /> {symbol} ({addr})
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