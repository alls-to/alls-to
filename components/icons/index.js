import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'
import iconCheck from 'components/icons/icon-check.svg'
import iconError from 'components/icons/icon-error.svg'
import iconInfo from 'components/icons/icon-info.svg'
import iconWarning from 'components/icons/icon-warning.svg'
import iconDisconnect from 'components/icons/icon-disconnect.svg'
import iconCopy from 'components/icons/icon-copy.svg'
import iconEdit from 'components/icons/icon-edit.svg'
import iconLink from 'components/icons/icon-link.svg'
import iconShare from 'components/icons/icon-share.svg'
import iconTwitter from 'components/icons/icon-twitter.svg'
import iconTelegram from 'components/icons/icon-telegram.svg'
import iconDownload from 'components/icons/icon-download.svg'
import iconLink2 from 'components/icons/icon-link-2.svg'
import iconCamera from 'components/icons/icon-camera.svg'

const ICONS = {
  'icon-check': iconCheck,
  'icon-iconEror': iconError,
  'icon-info': iconInfo,
  'icon-warning': iconWarning,
  'icon-disconnect': iconDisconnect,
  'icon-copy': iconCopy,
  'icon-edit': iconEdit,
  'icon-link': iconLink,
  'icon-link2': iconLink2,
  'icon-share': iconShare,
  'icon-twitter': iconTwitter,
  'icon-telegram': iconTelegram,
  'icon-download': iconDownload,
  'icon-camera': iconCamera
}

export default function Icon({
  className = undefined,
  type = '',
}) {
  let icon
  if (ICONS[type]) {
    const IconComponent = ICONS[type]
    icon = <IconComponent />
  }
  if (!icon) {
    console.warn('Unknown icon type:' + type)
    return null
  }

  return (
    <span
      className={classNames(
        'inline-flex w-full h-full items-center justify-center shrink-0 select-none',
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
