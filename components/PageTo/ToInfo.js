import React from 'react'
import dynamic from 'next/dynamic'
import { saveAs } from 'file-saver'

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import mesonPresets from '@mesonfi/presets'

import Card from 'components/common/Card'
import TokenIcon from 'components/common/Icon/TokenIcon'
import NetworkIcon from 'components/common/Icon/NetworkIcon'

const MesonToEmbedded = dynamic(
  import('@mesonfi/to').then(t => t.MesonToEmbedded),
  { ssr: false }
)

export default function ToInfo ({ to }) {
  const uid = to.uid || to.address

  const saveImage = React.useCallback(async () => {
    await saveAs(`https://img.meson.fi/to/${uid}/share`, `Alls_to_${to.name}.png`)
  }, [uid, to.name])

  const network = mesonPresets.getNetwork(to.networkId)
  const token = network.tokens.find(t => t.symbol.toLowerCase().includes(to.tokens[0]))

  return (
    <Card bg='pos2' className='text-primary'>
      <div className='flex flex-row justify-between'>
        <div className='font-bold'>PAY TO</div>
        <div className='font-bold cursor-pointer hover:underline' onClick={saveImage}>
          SHARE
        </div>
      </div>

      <div className='mt-5 self-center w-16 h-16 rounded-full border-2 border-white box-content'>
        <Jazzicon seed={jsNumberForAddress(to.address)} diameter={64} />
      </div>
      
      <div className='mt-5 flex flex-col items-center'>
        <div className='font-bold'>{to.name}</div>
        <div className='mt-1 text-sm'>{to.desc}</div>
      </div>

      <div className='mt-5 flex flex-row items-center justify-center bg-primary bg-opacity-5 rounded-xl p-4 text-sm'>
        <div>{to.name} will receive</div>
        <div className='flex items-center mx-1 mb-0.5'><TokenIcon size='sm' symbol={to.tokens[0]} /></div>
        <div className='font-bold mr-1'>{token?.symbol}</div>on
        <div className='flex items-center mx-1 mb-0.5'><NetworkIcon size='sm' id={to.networkId} /></div>
        <div className='font-bold'>{network.name}</div>
      </div>

      <div className='mt-4 -mx-2'>
        <MesonToEmbedded
          appId='alls-to'
          to={{ addr: to.address, chain: to.networkId, tokens: to.tokens }}
          onCompleted={() => {}}
        />
      </div>
    </Card>
  )
}
