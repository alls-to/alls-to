import React from 'react'
import classnames from 'classnames'
import dynamic from 'next/dynamic'
import Image from 'next/image'

import { saveAs } from 'file-saver'
import { utils } from 'ethers'

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import mesonPresets from '@mesonfi/presets'

import Card from 'components/common/Card'
import { DropdownMenu } from 'components/common/Dropdown'
import Button from 'components/common/Button'
import NetworkIcon from 'components/common/Icon/NetworkIcon'
import TokenIcon from 'components/common/Icon/TokenIcon'

import iconShare from './icons/share.svg'
import iconDownload from './icons/download.svg'
import iconTwitter from './icons/twitter.svg'
import iconTelegram from './icons/telegram.svg'
import iconLink from './icons/link.svg'
import iconCheck from './icons/check.svg'

const MesonToEmbedded = dynamic(
  import('@mesonfi/to').then(t => t.MesonToEmbedded),
  { ssr: false }
)

export default function ToInfo ({ to }) {
  const uid = to.uid || to.address
  const link = `https://alls.to/${to.uid || to.address.substring(0, 12)}`
  const name = to.name || uid

  const saveImage = React.useCallback(async () => {
    await saveAs(`https://img.meson.fi/to/${uid}/share`, `Alls_to_${name}.png`)
  }, [uid, name])

  const shareTwitter = React.useCallback(async () => {
    const text = `Make stablecoin transfers to me\n\n${link}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
  }, [link])

  const shareTelegram = React.useCallback(async () => {
    const text = `Make stablecoin transfers to me`
    window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`, '_blank')
  }, [link])

  const network = mesonPresets.getNetwork(to.networkId)
  const token = network.tokens.find(t => t.symbol.toLowerCase().includes(to.tokens[0]))

  return (
    <Card bg='pos2' className='p-3 xs:p-4 md:p-6 text-primary'>
      <div className='flex flex-row justify-between px-1 xs:px-0'>
        <div className='font-semibold'>TRANSFER TO</div>
        <DropdownMenu
          className='-my-1 -mr-3'
          btn={
            <Button size='xs' type='pure'>
              <div className='flex h-4 w-4 mr-2'><Image fill='true' alt='' src={iconShare} /></div>
              SHARE
            </Button>
          }
          options={[
            {
              text: <><div className='flex h-4 w-4 mr-2'><Image fill='true' alt='' src={iconDownload} /></div>Save Image with QR</>,
              onClick: saveImage
            },
            {
              text: <><div className='flex h-4 w-4 mr-2'><Image fill='true' alt='' src={iconTwitter} /></div>Share on Twitter</>,
              onClick: shareTwitter
            },
            {
              text: <><div className='flex h-4 w-4 mr-2'><Image fill='true' alt='' src={iconTelegram} /></div>Share on Telegram</>,
              onClick: shareTelegram
            },
            {
              text: <><div className='flex h-4 w-4 mr-2'><Image fill='true' alt='' src={iconLink} /></div>Copy Link</>,
              onClick: async () => {
                await navigator.clipboard.writeText(link)
              }
            }
          ]}
        />
      </div>

      <div className='mt-5 self-center w-16 h-16 rounded-full border-2 border-white box-content'>
        <Jazzicon seed={jsNumberForAddress(to.address)} diameter={64} />
      </div>
      
      <div className='mt-5 flex flex-col items-center'>
        <div className={classnames('break-all text-center', (to.name || to.uid) ? 'font-bold text-lg' : 'font-medium text-sm')}>
          {name}
        </div>
        <div className='mt-1 text-sm'>{to.desc}</div>
      </div>

      <div className='mt-5 flex flex-row flex-wrap items-center justify-center bg-primary bg-opacity-5 rounded-xl p-4 text-sm'>
        <div className='break-all text-center'>{name}</div>
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
          to={{ addr: to.address, chain: to.networkId, tokens: to.tokens }}
          SuccessInfo={SuccessInfo}
        />
      </div>
    </Card>
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
            <Image alt='' width={24} height={24} src={iconCheck} />
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
        <Button className='flex-1 text-sm' type='primary' onClick={onNewTransfer}>
          ANOTHER TRANSFER
        </Button>
        <Button
          className='flex-1 text-sm'
          as='a'
          href='https://alls.to'
          target='_blank'
          rel='noreferrer'
        >CREATE MY LINK</Button>
      </div>
    </div>
  )
}