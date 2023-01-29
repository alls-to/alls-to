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
        className='block absolute bottom-px right-px w-5 h-5 flex items-center justify-center hover:contrast-75'
        href={badge.href}
        target='_blank'
        rel='noreferrer'
      >
        <div className='absolute w-3 h-3 bg-white rounded-full' />
        <Icon type={badge.type} className='absolute w-5 h-5' />
      </a>
    </div>
  )
}