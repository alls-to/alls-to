import React from 'react'
import classnames from 'classnames'
import dynamic from 'next/dynamic'
import { utils } from 'ethers'

import mesonPresets from '@mesonfi/presets'

import Button from 'components/common/Button'
import NetworkIcon from 'components/common/Icon/NetworkIcon'
import TokenIcon from 'components/common/Icon/TokenIcon'
import Icon from 'components/icons'

import Avatar from './Avatar'
import AvatarWrapper from './Avatar/AvatarWrapper'
import SocialButtons from './SocialButtons'
import { DIDs } from 'lib/did'

const MesonToEmbedded = dynamic(
  import('@mesonfi/to').then(t => t.MesonToEmbedded),
  { ssr: false }
)

export default function CardBodyTransfer ({ to }) {
  const title = to.name || (to.key ? to.handle : to.addr)

  const network = mesonPresets.getNetwork(to.networkId)
  const token = network.tokens.find(t => t.symbol.toLowerCase().includes(to.tokens[0]))
  const didLink = DIDs.find(item => item.id === to.did)?.link
  const didProfileUrl = didLink ? `${didLink}/${to.handle}`: ''

  return (
    <>
      <div className='mt-5 self-center'>
        <AvatarWrapper badge={{ type: to.did, href: didProfileUrl }}>
          <Avatar addr={to.addr} url={to.avatar}/>
        </AvatarWrapper>
      </div>
      
      <div className='mt-3 flex flex-col items-center'>
        <div className={classnames('break-all text-center', (to.name || to.key) ? 'font-bold text-lg' : 'font-medium text-sm')}>
          {title}
        </div>
        <div className='text-sm mt-1'>{to.bio}</div>
        <SocialButtons socials={to.socials} size='sm' className='mt-2' />
      </div>

      <div className='mt-5 flex flex-row flex-wrap items-center justify-center bg-primary bg-opacity-5 rounded-xl p-4 text-sm'>
        <div className='break-all text-center'>{title}</div>
        <div className='ml-1'>will receive</div>
        <div className='flex flex-row'>
          <div className='ml-1 h-4'><TokenIcon id={to.tokens[0]} /></div>
          <div className='ml-1 font-bold'>{token?.symbol}</div>
          <div className='ml-1'>on</div>
          <div className='ml-1 h-4'><NetworkIcon id={to.networkId} /></div>
          <div className='ml-1 font-bold'>{network.name}</div>.
        </div>
        <div className='ml-1'>You can transfer from any network you like.</div>
      </div>

      <div className='mt-4 -mx-2 -mb-4'>
        <MesonToEmbedded
          appId='alls-to'
          to={{ addr: to.addr, chain: to.networkId, tokens: to.tokens }}
          SuccessInfo={SuccessInfo}
        />
      </div>
    </>
  )
}

function SuccessInfo ({ data, onNewTransfer }) {
  return (
    <div className='flex flex-col justify-between w-full h-full px-2 pb-4'>
      <div className='mt-6 flex flex-col items-center'>
        <div className='font-bold'>Successful</div>

        <div className='mt-5 flex flex-row items-center'>
          <div className='w-6 h-6 m-px'>
            <NetworkIcon size={24} id={data.from?.chain} />
          </div>
          <div className='-ml-1 w-6 h-6 rounded-full box-content border border-white bg-white z-10'>
            <TokenIcon size={24} id={data.from?.token.toLowerCase()} />
          </div>

          <div className='bg-green h-0.5 w-16 rounded-full mx-px' />
          <div className='w-6 h-6 rounded-full bg-green m-px'>
            <Icon type='check' />
          </div>

          <div className='bg-green h-0.5 w-16 rounded-full mx-px' />

          <div className='w-6 h-6 m-px'>
            <NetworkIcon size={24} id={data.to?.chain} />
          </div>
          <div className='-ml-1 w-6 h-6 rounded-full box-content border border-white bg-white z-10'>
            <TokenIcon size={24} id={data.to?.token.toLowerCase()} />
          </div>
        </div>

        <div className='mt-2 text-sm'>{utils.formatUnits(data.amount || 0, 6)} {data.to?.token}</div>
      </div>

      <div className='flex w-full gap-2'>
        <Button className='flex-1 !text-sm' type='primary' onClick={onNewTransfer}>
          ANOTHER TRANSFER
        </Button>
        <Button
          className='flex-1 !text-sm'
          as='a'
          href='https://alls.to'
          target='_blank'
          rel='noreferrer'
        >CREATE MY LINK</Button>
      </div>
    </div>
  )
}