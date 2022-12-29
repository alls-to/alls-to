import React from 'react'

import Button from '../Button'
import TokenIcon from '../Icon/TokenIcon'

export default function TokenButton ({ id, symbol, selected, onToggle, disabled }) {
  return (
    <Button size='round' type={selected ? 'primary' : 'default'} disabled={disabled} onClick={() => onToggle(id)}>
      <div className='-ml-1 relative w-[22px] h-[22px] rounded-full bg-white'>
        <TokenIcon id={id} />
      </div>
      <div className='ml-1.5'>{symbol}</div>
    </Button>
  )
}
