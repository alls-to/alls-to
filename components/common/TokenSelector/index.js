import React from 'react'

import Button from '../Button'
import TokenIcon from '../Icon/TokenIcon'

export default function TokenSelector ({ symbol, selected, onToggle, disabled }) {
  return (
    <Button size='round' type={selected ? 'primary' : 'default'} disabled={disabled} onClick={() => onToggle(symbol)}>
      <div className='-ml-1 relative w-[22px] h-[22px] rounded-full bg-white'>
        <TokenIcon symbol={symbol} />
      </div>
      <div className='ml-1.5'>{symbol.toUpperCase()}</div>
    </Button>
  )
}
