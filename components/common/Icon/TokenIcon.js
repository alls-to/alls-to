import React from 'react'
import Image from 'next/image'

import usdc from './tokens/usdc.png'
import usdt from './tokens/usdt.png'
import busd from './tokens/busd.png'

const ICONS = { usdc, usdt, busd }
const SIZES = { sm: 16, md: 24 }

export default function TokenIcon ({ symbol, size = 'md' }) {
  return (
    <Image alt={symbol} width={SIZES[size]} height={SIZES[size]} src={ICONS[symbol]} />
  )
}
