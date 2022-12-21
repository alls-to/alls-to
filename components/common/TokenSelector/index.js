import React from 'react'
import Image from 'next/image'

import Button from '../Button'

import usdc from './usdc.png'
import usdt from './usdt.png'
import busd from './busd.png'

const ICONS = { usdc, usdt, busd }

export default function TokenSelector ({ symbol, selected, onToggle }) {
  return (
    <Button size='round' type={selected ? 'primary' : 'default'} onClick={() => onToggle(symbol)}>
      <div className='-ml-1 relative w-6 h-6 rounded-full bg-white'>
        <Image alt={symbol} className='w-6 h-6' layout='fill' src={ICONS[symbol]} />
      </div>
      <div className='ml-2'>{symbol.toUpperCase()}</div>
    </Button>
  )
}