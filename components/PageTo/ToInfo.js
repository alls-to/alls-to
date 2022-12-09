import React from 'react'
import dynamic from 'next/dynamic'

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { QRCodeSVG } from 'qrcode.react'
import Card from 'components/common/Card'

const MesonToEmbedded = dynamic(
  import('@mesonfi/to').then(t => t.MesonToEmbedded),
  { ssr: false }
)

export default function ToInfo ({ to }) {
  const uid = to.uid || to.address

  return (
    <Card bg='pos2' className='mt-4 mb-12 px-2 md:px-4 w-[428px]'>
      <div className='self-center w-16 h-16 rounded-full border-2 border-white box-content'>
        <Jazzicon seed={jsNumberForAddress(to.address)} diameter={64} />
      </div>
      
      <div className='my-4 flex flex-col items-center'>
        <div className='font-semibold text-xl mb-1'>{to.name}</div>
        <div className='font-light text-sm text-gray-800'>{to.desc}</div>
      </div>

      <MesonToEmbedded
        appId='alls-to'
        to={to}
        onCompleted={() => {}}
      />
      {/* <div className='mt-4 p-2 bg-white rounded-lg'>
        <QRCodeSVG size={108} value={`https://alls.to/${to.uid}`} />
      </div> */}
    </Card>
  )
}
