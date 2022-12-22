import React from 'react'

import Button from '../Button'
import TokenIcon from '../Icon/TokenIcon'

export default function TokenSelector ({ symbol, selected, onToggle }) {
  return (
    <Button size='round' type={selected ? 'primary' : 'default'} onClick={() => onToggle(symbol)}>
      <div className='-ml-1 relative w-6 h-6 rounded-full bg-white'>
        <TokenIcon symbol={symbol} />
      </div>
      <div className='ml-2'>{symbol.toUpperCase()}</div>
    </Button>
  )
}
