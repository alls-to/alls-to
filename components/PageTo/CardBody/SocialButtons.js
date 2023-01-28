import classnames from 'classnames'

import Icon from 'components/icons'

export default function SocialButtons ({ socials, className }) {
  if (!socials?.length) {
    return null
  }

  return (
    <div className={classnames('flex gap-3', className)}>
    {
      socials.filter(item => item.type).map(item => (
        <a
          key={item.type}
          className='flex items-center justify-center w-4 h-4 text-primary/50 hover:text-primary overflow-hidden'
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
