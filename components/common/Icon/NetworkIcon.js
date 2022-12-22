import React from 'react'
import Image from 'next/image'

import aptos from './networks/aptos.png'
import arb from './networks/arbitrum.png'
import aurora from './networks/aurora.png'
import avax from './networks/avalanche.png'
import bnb from './networks/bnb.png'
import cfx from './networks/conflux.png'
import cronos from './networks/cronos.png'
import eth from './networks/ethereum.png'
import ftm from './networks/fantom.png'
import movr from './networks/moonriver.png'
import beam from './networks/moonbeam.png'
import opt from './networks/optimism.png'
import polygon from './networks/polygon.png'
import tron from './networks/tron.png'
import zksync from './networks/zksync.png'

const ICONS = { aptos, arb, aurora, avax, bnb, cfx, cronos, eth, ftm, movr, beam, opt, polygon, tron, zksync }
const SIZES = { sm: 16, md: 28 }

export default function NetworkIcon ({ id, size = 'md' }) {
  return (
    <Image alt={id} width={SIZES[size]} height={SIZES[size]} src={ICONS[id]} />
  )
}
