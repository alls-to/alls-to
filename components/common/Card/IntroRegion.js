import React from 'react'
import Image from 'next/image'

import Card from 'components/common/Card'
import NetworkIcon from 'components/common/Icon/NetworkIcon'
import TokenIcon from 'components/common/Icon/TokenIcon'

import dots from './dots.png'
import arrow from './arrow.png'

export default function IntroRegion ({ networkId = 'polygon', token = 'usdc', side, steps = [], children }) {
  return (
    <div className='relative w-[280px] text-sm'>
      <div className='font-medium'>Why use ALLsTo?</div>

      <div className='font-light mt-3 leading-[20px]'>
        ALLsTo helps you collect stablecoins from any blockchain network, and you will receive all incoming transfers on a single network.
        <Card bg='' className='mt-3 p-4'>
          <div className='flex flex-row justify-between items-center'>
            <div className='w-[88px]'>
              <div className='text-xs font-medium mb-2'>Send from any network</div>
              <div className='flex gap-2'>
                <NetworkIcon id='eth' />
                <NetworkIcon id='bnb' />
                <NetworkIcon id='polygon' />
                <Image alt='' width={16} height={16} src={dots} />
              </div>
            </div>
            <Image alt='' width={12} height={12} src={arrow} />
            <div className='w-[88px]'>
              <div className='text-xs font-medium mb-2'>Receive all transfers as</div>
              <div className='flex gap-2'>
                <TokenIcon id={token} />
                <span className='leading-4 text-xs'>on</span>
                <NetworkIcon id={networkId} />
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
            <div className='mt-1 text-primary/50'>{step.desc}</div>
          </React.Fragment>
        ))
      }
      </div>
      {children && <div className='mt-6 inline-block'>{children}</div>}
    </div>
  )
}
