import React from 'react'
import presets from '@mesonfi/presets'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { QRCodeSVG } from 'qrcode.react'

import Card from 'components/common/Card'
import TokenSelector from 'components/common/TokenSelector'

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
        <div className='mt-3 flex flex-row gap-3'>
          {to.tokens.map(symbol => <TokenSelector key={`token-${symbol}`} selected symbol={symbol} />)}
        </div>
      </div>

      <div className='mt-8 p-2 bg-white rounded-lg'>
        <QRCodeSVG size={108} value={`https://alls.to/${to.uid}`} />
      </div>
    </Card>
  )
}
