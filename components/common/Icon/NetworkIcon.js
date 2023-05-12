import React from 'react'
import Image from 'next/image'

import aptos from './networks/aptos.png'
import arb from './networks/arb.png'
import aurora from './networks/aurora.png'
import avax from './networks/avax.png'
import bnb from './networks/bnb.png'
import cfx from './networks/cfx.png'
import cronos from './networks/cronos.png'
import eth from './networks/eth.png'
import ftm from './networks/ftm.png'
import movr from './networks/movr.png'
import beam from './networks/beam.png'
import opt from './networks/opt.png'
import polygon from './networks/polygon.png'
import sui from './networks/sui.png'
import tron from './networks/tron.png'
import zksync from './networks/zksync.png'
import zkevm from './networks/zkevm.png'

const ICONS = { aptos, arb, aurora, avax, bnb, cfx, cronos, eth, ftm, movr, beam, opt, polygon, sui, tron, zksync, zkevm }

export default function NetworkIcon ({ id, size = 16 }) { // 'md'
  return (
    <Image alt={id} width={size} height={size} src={ICONS[id]} />
  )
}
