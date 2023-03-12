import React from 'react'

import { saveAs } from 'file-saver'

import refs from 'lib/refs'

import { DropdownMenu } from 'components/common/Dropdown'
import Button from 'components/common/Button'
import Icon from 'components/icons'

export default function ShareButton ({ to }) {
  const link = `https://alls.to/${to.handle}`

  const keyOrAddr = to.key || to.addr
  const name = to.name || keyOrAddr
  const saveImage = React.useCallback(async () => {
    await saveAs(`https://img.meson.fi/to/${encodeURIComponent(keyOrAddr)}/share`, `AllsTo_${name}.png`)
  }, [keyOrAddr, name])

  const shareTwitter = React.useCallback(async () => {
    const text = `@alls_to - The Future of Web3 Payment Gateway. Making transfers in #stablecoin easier than ever for #web3 payment solutions.\n\nUse my payment link to transfer stablecoin today at: ${link}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
  }, [link])

  const shareTelegram = React.useCallback(async () => {
    const text = `Make stablecoin transfers to me`
    window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`, '_blank')
  }, [link])

  const copyLink = React.useCallback(async () => {
    await navigator.clipboard.writeText(link)
    refs.toast.current?.show({ title: 'Link Copied!' })
  }, [link])

  return (
    <DropdownMenu
      className='-my-1 -mr-3'
      btn={
        <Button size='xs' type='pure'>
          <div className='flex h-4 w-4 mr-2'><Icon type='share' /></div>
          SHARE
        </Button>
      }
      options={[
        {
          text: <><div className='flex h-4 w-4 mr-2'><Icon type='download' /></div>Save Image</>,
          onClick: saveImage
        },
        {
          text: <><div className='flex h-4 w-4 mr-2'><Icon type='twitter_gray' /></div>Share on Twitter</>,
          onClick: shareTwitter
        },
        {
          text: <><div className='flex h-4 w-4 mr-2'><Icon type='telegram_gray' /></div>Share on Telegram</>,
          onClick: shareTelegram
        },
        {
          text: <><div className='flex h-4 w-4 mr-2'><Icon type='link2' /></div>Copy Link</>,
          onClick: copyLink
        }
      ]}
    />
  )
}

