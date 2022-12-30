import React from 'react'
import Image from 'next/image'

import Card from 'components/common/Card'
import NetworkIcon from 'components/common/Icon/NetworkIcon'
import TokenIcon from 'components/common/Icon/TokenIcon'

import dots from './dots.png'

export default function IntroRegion ({ networkId, token, side, steps = [], button }) {
  return (
    <div className='relative w-[280px] text-sm'>
      <div className='font-medium'>What is Alls.To?</div>

      <div className='font-light mt-3'>
        Alls.to is a xxx.
        <Card bg='' className='mt-3 p-4'>
          <div className='flex flex-row justify-between'>
            <div className='w-[88px]'>
              <div className='text-xs font-medium mb-2'>Send from any network</div>
              <div className='flex gap-2'>
                <NetworkIcon size='sm' id='eth' />
                <NetworkIcon size='sm' id='bnb' />
                <NetworkIcon size='sm' id='polygon' />
                <Image alt='' width={16} height={16} src={dots} />
              </div>
            </div>
            <div className='w-[88px]'>
              <div className='text-xs font-medium mb-2'>Receive all transfers as</div>
              <div className='flex gap-2'>
                <TokenIcon size='sm' id={token} />
                <span className='leading-4'>on</span>
                <NetworkIcon size='sm' id={networkId} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {side && <div className='font-medium mt-6'>{side}</div>}
      <div className='ml-7 font-light'>
      {
        steps.map((step, i) => (
          <React.Fragment key={`key-${i}`}>
            <div className='mt-3 flex flex-row'>
              <div className='-ml-4 w-4'>{i+1}.</div>
              <div>{step.title}</div>
            </div>
            <div className='mt-1 text-primary/40'>{step.desc}</div>
          </React.Fragment>
        ))
      }
      </div>
      {button && <div className='mt-6 inline-block'>{button}</div>}
    </div>
  )
}
