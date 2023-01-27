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
import iconShare from './share.svg'
import iconWarning from './warning.svg'
import iconTwitter from './socials/twitter.svg'
import iconTelegram from './socials/telegram.svg'
import iconGithub from './socials/github.svg'
import iconCyberconnect from './did/cyberconnect.svg'

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
  share: iconShare,
  warning: iconWarning,
  twitter: iconTwitter,
  telegram: iconTelegram,
  github: iconGithub,
  cyberconnect: iconCyberconnect,
}

export default function Icon({ className, type = '' }) {
  let icon
  if (ICONS[type]) {
    const IconComponent = ICONS[type]
    icon = <IconComponent className={className} />
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
