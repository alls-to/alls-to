import React from 'react'
import Image from 'next/image'

import usdc from './tokens/usdc.png'
import usdt from './tokens/usdt.png'
import busd from './tokens/busd.png'
import tomo_cusd from './tokens/tomo_cusd.png'

const ICONS = { usdc, usdt, busd, tomo_cusd }

export default function TokenIcon ({ id, size = 16 }) {
  return (
    <Image alt={id} width={size} height={size} src={ICONS[id]} />
  )
}
