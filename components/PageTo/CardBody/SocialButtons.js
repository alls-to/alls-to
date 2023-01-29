import classnames from 'classnames'

import Icon from 'components/icons'

export default function SocialButtons ({ socials, size, className }) {
  if (!socials?.length) {
    return null
  }

  return (
    <div className={classnames('flex gap-3', className)}>
    {
      socials.filter(item => item.type).map(item => (
        <a
          key={item.type}
          className={classnames(
            'flex items-center justify-center hover:opacity-80 overflow-hidden',
            size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
          )}
          href={item.link.startsWith('http') ? item.link : `https://${item.link}`}
          target='_blank'
          rel='noreferrer'
        >
          <Icon type={item.type} />
        </a>
      ))
    }
    </div>
  )
}
