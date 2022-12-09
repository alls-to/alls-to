import React from 'react'
import classnames from 'classnames'
import Image from 'next/image'

import usdc from './usdc.png'
import usdt from './usdt.png'
import busd from './busd.png'

const ICONS = { usdc, usdt, busd }

export default function TokenSelector ({ symbol, selected, onToggle }) {
  return (
    <div
      onClick={() => onToggle?.(symbol)}
      className={classnames(
        'flex items-center p-1 pr-3 rounded-full border border-[#0B2750]',
        selected ? 'bg-[#0B2750] text-white' : 'text-[#0B2750]',
        onToggle && 'cursor-pointer'
      )}
    >
      <div className='relative w-6 h-6 mr-2 rounded-full bg-white'>
        <Image alt={symbol} className='w-6 h-6' layout='fill' src={ICONS[symbol]} />
      </div>
      <div className='text-sm font-semibold leading-none'>{symbol.toUpperCase()}</div>
    </div>
  )
}