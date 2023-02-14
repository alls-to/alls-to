import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'

import iconCamera from './camera.svg'
import iconCheck from './check.svg'
import iconCopy from './copy.svg'
import iconDownload from './download.svg'
import iconDisconnect from './disconnect.svg'
import iconEdit from './edit.svg'
import iconError from './error.svg'
import iconInfo from './info.svg'
import iconLink from './link.svg'
import iconLink2 from './link2.svg'
import iconOpen from './open.svg'
import iconShare from './share.svg'
import iconUnsync from './unsync.svg'
import iconWallet from './wallet.svg'
import iconWarning from './warning.svg'

import iconLink3 from './did/link3.svg'
import iconDotbit from './did/dotbit.svg'
import iconDotbitBadge from './did/dotbit-badge.svg'

import iconTelegramGray from './socials/telegram_gray.svg'
import iconTwitterGray from './socials/twitter_gray.svg'

import iconDiscord from './socials/discord.svg'
import iconTelegram from './socials/telegram.svg'
import iconTwitter from './socials/twitter.svg'
import iconGithub from './socials/github.svg'
import iconLinkedin from './socials/linkedin.svg'
import iconMedium from './socials/medium.svg'

const ICONS = {
  camera: iconCamera,
  check: iconCheck,
  copy: iconCopy,
  download: iconDownload,
  disconnect: iconDisconnect,
  edit: iconEdit,
  error: iconError,
  info: iconInfo,
  link: iconLink,
  link2: iconLink2,
  open: iconOpen,
  share: iconShare,
  unsync: iconUnsync,
  wallet: iconWallet,
  warning: iconWarning,
  twitter_gray: iconTwitterGray,
  telegram_gray: iconTelegramGray,
  twitter: iconTwitter,
  telegram: iconTelegram,
  discord: iconDiscord,
  github: iconGithub,
  linkedin: iconLinkedin,
  medium: iconMedium,
  link3: iconLink3,
  dotbit: iconDotbit,
  'dotbit-badge': iconDotbitBadge
}

export default function Icon({ className, type = '' }) {
  let icon
  if (ICONS[type]) {
    const IconComponent = ICONS[type]
    icon = <IconComponent className='w-full h-full' />
  }
  if (!icon) {
    console.warn('Unknown icon type:' + type)
    return null
  }

  return (
    <span
      className={classNames(
        'flex w-full h-full items-center justify-center shrink-0 select-none',
        className
      )}
    >
      {icon}
    </span>
  )
}

Icon.propTypes = {
  type: PropTypes.oneOf(Object.keys(ICONS)),
  className: PropTypes.string
}
