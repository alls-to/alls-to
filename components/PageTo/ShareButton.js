import React from 'react'
import Image from 'next/image'

import { saveAs } from 'file-saver'

import { DropdownMenu } from 'components/common/Dropdown'
import Button from 'components/common/Button'

import refs from 'lib/refs'

import iconShare from './icons/share.svg'
import iconDownload from './icons/download.svg'
import iconTwitter from './icons/twitter.svg'
import iconTelegram from './icons/telegram.svg'
import iconLink from './icons/link.svg'
import Icon from 'components/icons'

export default function ShareButton ({ to }) {
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

  const copyLink = React.useCallback(async () => {
    await navigator.clipboard.writeText(link)
    refs.toast.current?.show({ title: 'Link Copied!' })
  }, [link])

  return (
    <DropdownMenu
      className='-my-1 -mr-3'
      btn={
        <Button size='xs' type='pure'>
          <div className='flex h-4 w-4 mr-2'><Icon type='icon-share' /></div>
          SHARE
        </Button>
      }
      options={[
        {
          text: <><div className='flex h-4 w-4 mr-2'><Icon type='icon-download' /></div>Save Image</>,
          onClick: saveImage
        },
        {
          text: <><div className='flex h-4 w-4 mr-2'><Icon type='icon-twitter' /></div>Share on Twitter</>,
          onClick: shareTwitter
        },
        {
          text: <><div className='flex h-4 w-4 mr-2'><Icon type='icon-telegram' /></div>Share on Telegram</>,
          onClick: shareTelegram
        },
        {
          text: <><div className='flex h-4 w-4 mr-2'><Icon type='icon-link2' /></div>Copy Link</>,
          onClick: copyLink
        }
      ]}
    />
  )
}

