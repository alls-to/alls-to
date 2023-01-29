import React from 'react'

import { saveAs } from 'file-saver'

import refs from 'lib/refs'

import { DropdownMenu } from 'components/common/Dropdown'
import Button from 'components/common/Button'
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

