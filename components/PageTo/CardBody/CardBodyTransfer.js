import React from 'react'
import classnames from 'classnames'
import dynamic from 'next/dynamic'
import { utils } from 'ethers'
import { saveAs } from 'file-saver'
import mesonPresets from '@mesonfi/presets'
import { Popover, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import Button from 'components/common/Button'
import NetworkIcon from 'components/common/Icon/NetworkIcon'
import TokenIcon from 'components/common/Icon/TokenIcon'
import Icon from 'components/icons'

import Avatar from './Avatar'
import AvatarWrapper from './Avatar/AvatarWrapper'
import SocialButtons from './SocialButtons'
import { DIDs } from 'lib/did'
import ValidatorModal from './ValidatorModal'

const MesonToEmbedded = dynamic(
  import('@mesonfi/to').then(t => t.MesonToEmbedded),
  { ssr: false }
)

const DotBitInfoSection = ({ to, didProfileUrl }) => {
  const [openAliasPop, setOpenAliasPop] = React.useState(false)

  return (
    <>
      <div className={classnames('break-all text-center max-w-[254px]', (to.name || to.key) ? 'font-bold' : 'font-medium text-sm')}>
        {to.addr}
      </div>
      <Popover className='relative'>
        {() => (
          <>
            <Popover.Button className='mt-1 mb-3 outline-0'>
              <div onMouseOver={() => setOpenAliasPop(true)} onMouseLeave={() => setOpenAliasPop(false)} className='bg-primary hover:bg-primary/80 py-[2px] px-1 rounded-[6px] text-[14px] text-white flex items-center cursor-pointer'>
                <Icon type='dotbit-badge' className='w-4 h-4 group-hover:contrast-75 mr-1' /> {to.key}
              </div>
            </Popover.Button>
            <Transition
              as={Fragment}
              show={openAliasPop}
              enter='transition ease-out duration-200'
              enterFrom='opacity-0 translate-y-1'
              enterTo='opacity-100 translate-y-0'
              leave='transition ease-in duration-150'
              leaveFrom='opacity-100 translate-y-0'
              leaveTo='opacity-0 translate-y-1'
            >
              <Popover.Panel className='absolute left-1/2 z-10 -translate-x-1/2 px-3'>
                <div className='relative shadow-lg p-3 rounded-lg bg-white flex flex-no-wrap items-center text-[14px] leading-[18px] whitespace-nowrap font-light'>
                  This address alias:
                  <div className='flex items-center ml-16 font-medium'>
                    <AvatarWrapper hiddenBadge size='sm' badge={{ type: to.did, href: didProfileUrl }}>
                      <Avatar diameter={16} addr={to.addr} url={to.avatar} />
                    </AvatarWrapper>
                    <span className='ml-1'>{to.key}</span>
                  </div>
                  <div className='absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-8 border-solid border-transparent border-b-white'></div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  )
}

const DefaultInfoSection = ({ to, title }) => {
  return (
    <div className={classnames('break-all text-center max-w-[254px]', (to.name || to.key) ? 'font-bold text-lg' : 'font-medium text-sm')}>
      {title}
    </div>
  )
}

export default function CardBodyTransfer({ to }) {
  const title = to.name || (to.key ? to.handle : to.addr)
  const validatorModalRef = React.useRef(null)
  const network = mesonPresets.getNetwork(to.networkId)
  const token = network?.tokens.find(t => t.symbol.toLowerCase().includes(to.tokens[0]))
  const didLink = DIDs.find(item => item.id === to.did)?.link
  const didProfileUrl = didLink ? `${didLink}/${to.handle}` : ''

  const isTestnet = !!mesonPresets.getNetwork('goerli')

  const onSwapAttempted = async () =>  {
    if (to.key.endsWith('.bit')) {
      return await validatorModalRef.current.openAndWaitCheck(to.key)
    }
    return true
  }

  return (
    <>
      <div className='mt-5 self-center'>
        <AvatarWrapper badge={{ type: to.did, href: didProfileUrl }}>
          <Avatar addr={to.addr} url={to.avatar} />
        </AvatarWrapper>
      </div>

      <div className='mt-4 flex flex-col items-center'>
        {
          to?.key?.endsWith('.bit') ? <DotBitInfoSection to={to} didProfileUrl={didProfileUrl} /> : <DefaultInfoSection to={to} title={title} />
        }
        <div className='text-sm'>{to.bio}</div>
        <SocialButtons socials={to.socials} size='sm' className='mt-3' />
      </div>

      <div className='mt-5 flex flex-row flex-wrap items-center justify-center bg-primary bg-opacity-5 rounded-xl p-4 text-sm'>
        <div className='break-all text-center'>{title}</div>
        <div className='ml-1'>will receive</div>
        <div className='flex flex-row'>
          <div className='ml-1 h-4'><TokenIcon id={to.tokens[0]} /></div>
          <div className='ml-1 font-bold'>{token?.symbol}</div>
          <div className='ml-1'>on</div>
          <div className='ml-1 h-4'><NetworkIcon id={to.networkId} /></div>
          <div className='ml-1 font-bold'>{network?.name}</div>.
        </div>
        <div className='ml-1'>You can transfer from any network you like.</div>
      </div>

      <div className='mt-4 -mx-2 -mb-4'>
        <MesonToEmbedded
          host={isTestnet ? 'https://testnet-allsto.meson.to' : 'https://t.alls.to'}
          appId='alls-to'
          onSwapAttempted={onSwapAttempted}
          to={{ addr: to.addr, chain: to.networkId, tokens: to.tokens }}
          SuccessInfo={SuccessInfo}
        />
      </div>
      <ValidatorModal to={to} ref={validatorModalRef} />
    </>
  )
}

function SuccessInfo({ data, onNewTransfer }) {
  let imgUrl
  let fileName
  const swapId = data?.swapId
  const hash = data?.hash

  if (swapId) {
    imgUrl = `https://img.meson.fi/to/receipt/${swapId}`
    fileName = `AllsTo_${swapId}.png`
  } else if (hash) {
    const inChain = mesonPresets.getNetwork(data.from.chain)?.shortSlip44
    const outChain = mesonPresets.getNetwork(data.to.chain)?.shortSlip44
    // TODO: use rpc method to replace the query.
    const queryData = {
      amount: data.amount,
      hash,
      created: new Date().toISOString(),
      from: data.fromAddress,
      to: data.initiator,
      inChain: inChain,
      outChain: outChain,
      inToken: data.from.token,
      outToken: data.to.token
    }
    imgUrl = `https://img.meson.fi/to/receipt/by-hash?${new URLSearchParams(queryData).toString()}`
    fileName = `AllsTo_${hash}.png`
  }

  const onSaveReceipt = React.useCallback(async () => {
    await saveAs(imgUrl, fileName)
  }, [imgUrl, fileName])

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
        <Button className='flex-1 !text-sm' type='primary' onClick={onSaveReceipt}>
          SAVE RECEIPT
        </Button>
        <Button
          className='flex-1 !text-sm'
          onClick={onNewTransfer}
        >ANOTHER TRANSFER</Button>
      </div>
    </div>
  )
}
