import React from 'react'
import Image from 'next/image'

import usdc from './tokens/usdc.png'
import usdt from './tokens/usdt.png'
import busd from './tokens/busd.png'

const ICONS = { usdc, usdt, busd }

export default function TokenIcon ({ id, size = 16 }) {
  return (
    <Image alt={id} width={size} height={size} src={ICONS[id]} />
  )
}
