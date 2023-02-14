import Icon from 'components/icons'

export default function AvatarWrapper ({ children, badge }) {
  const avatar = (
    <div className='bg-primary/10 w-16 h-16 rounded-full border-2 border-white box-content overflow-hidden'>
      {children}
    </div>
  )

  if (!badge?.type) {
    return avatar
  }

  return (
    <div className='relative'>
      {avatar}
      <a
        className='block absolute bottom-px right-px w-5 h-5 flex items-center justify-center group'
        href={badge.href}
        target='_blank'
        rel='noreferrer'
      >
        <Icon type={badge.type} className='absolute w-5 h-5 group-hover:contrast-75' />
      </a>
    </div>
  )
}