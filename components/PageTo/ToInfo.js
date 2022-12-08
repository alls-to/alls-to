import React from 'react'
import presets from '@mesonfi/presets'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import Card from 'components/common/Card'

export default function ToInfo ({ to }) {
  const uid = to.uid || to.address

  return (
    <Card className='mt-4 mb-12 w-[428px] items-center'>
      <div className='self-center w-16 h-16 rounded-full'>
        <Jazzicon seed={jsNumberForAddress(to.address)} diameter={64} />
      </div>
      
      <div className='mt-2 font-light text-xs text-gray-800'>{to.address}</div>

      <div className='mt-4 flex flex-col items-center'>
        <div className='font-bold text-xl'>{to.name}</div>
        <div className='font-light text-sm text-gray-800'>{to.desc}</div>
      </div>

      <div className='mt-4 flex flex-col items-center'>
        <div>{presets.getNetwork(to.networkId).name}</div>
        <div>{to.tokens.join(';')}</div>
      </div>
    </Card>
  )
}