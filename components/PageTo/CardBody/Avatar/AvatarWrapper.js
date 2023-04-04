import Icon from 'components/icons'
import classnames from 'classnames'

const avatarSizes = {
  lg: 'w-16 h-16',
  sm: 'w-4 w-4'
}

export default function AvatarWrapper({ children, size = 'lg', badge, hiddenBadge = false }) {
  const avatar = (
    <div className={classnames('bg-primary/10 flex rounded-full border-2 border-white box-content overflow-hidden', avatarSizes[size])}>
      {children}
    </div>
  )

  if (!badge?.type) {
    return avatar
  }

  let iconType = badge.type

  if (iconType === 'dotbit') {
    iconType = 'dotbit-badge'
  }

  return (
    <div className='relative'>
      {avatar}
      {
        !hiddenBadge && <a
          className='absolute bottom-px right-px w-5 h-5 flex items-center justify-center group'
          href={badge.href}
          target='_blank'
          rel='noreferrer'
        >
          <Icon type={iconType} className='absolute w-5 h-5 group-hover:contrast-75' />
        </a>
      }
    </div>
  )
}