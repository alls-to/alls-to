import React from 'react'
import classnames from 'classnames'
import difference from 'lodash/difference'

import presets from '@mesonfi/presets'

import TokenButton from 'components/common/TokenButton'

const getTokenOptions = networkId => {
  if (networkId === 'tron') {
    return ['USDT']
  } else if (networkId === 'aptos') {
    return ['USDC', 'USDT']
  }
  if (['avax', 'aurora'].includes(networkId)) {
    return ['USDC.e', 'USDT.e', 'BUSD.e']
  } else if (networkId === 'beam') {
    return ['xcUSDC', 'xcUSDT', 'BUSD']
  }
  return ['USDC', 'USDT', 'BUSD']
}

const getIdFromSymbol = symbol => {
  if (symbol.includes('USDC')) {
    return 'usdc'
  } else if (symbol.includes('USDT')) {
    return 'usdt'
  } else if (symbol.includes('BUSD')) {
    return 'busd'
  }
}

export default function TokenSelector ({ networkId, tokens, onChange }) {
  const { options, supported } = React.useMemo(() => {
    if (!networkId) {
      return { options: [], supported: [] }
    }
    return {
      options: getTokenOptions(networkId),
      supported: presets.getTokensForNetwork(networkId)
        .filter(t => t.tokenIndex < 255)
        .map(({ symbol }) => symbol)
    }
  }, [networkId])

  const unsupported = React.useMemo(() => difference(options, supported), [options, supported])

  React.useEffect(() => {
    if (!supported.map(getIdFromSymbol).includes(tokens[0])) {
      const id = getIdFromSymbol(supported[0])
      onChange([id])
    }
  }, [supported])

  const toggleToken = id => {
    if (tokens.includes(id)) {
      // setTokens(tokens.filter(t => t !== token))
    } else {
      onChange([id])
      // setTokens([...tokens, token])
    }
  }

  return (
    <>
      <div className='flex flex-row gap-3'>
      {options.map(symbol => {
        const id = getIdFromSymbol(symbol)
        return (
          <TokenButton
            key={`token-${symbol}`}
            id={id}
            symbol={symbol}
            selected={tokens.includes(id)}
            onToggle={toggleToken}
            disabled={!supported.includes(symbol)}
          />
        )
      })}
      </div>
      <div className='mt-1 text-xs text-primary/50'>
        {unsupported.length ? 'Some stablecoins are not supported on this network.' : ''}
      </div>
    </>
  )
}