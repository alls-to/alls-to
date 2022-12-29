import React from 'react'
import Image from 'next/image'

import usdc from './tokens/usdc.png'
import usdt from './tokens/usdt.png'
import busd from './tokens/busd.png'

const ICONS = { usdc, usdt, busd }
const SIZES = { sm: 16, md: 22 }

export default function TokenIcon ({ id, size = 'md' }) {
  return (
    <Image alt={id} width={SIZES[size]} height={SIZES[size]} src={ICONS[id]} />
  )
}
