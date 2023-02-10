import classnames from 'classnames'

import { abbreviate } from 'lib'

import Button from './Button'

export default function ConnectedButton ({ hideAddress, icon, addr = '', className }) {
  return (
    <Button size='sm' type='white' className={classnames('!px-2', className)}>
      <div className={classnames('w-5 h-5', !addr && 'filter-gray')}>
        <img alt='' crossOrigin='anonymous' className='w-5 h-5' src={icon} />
      </div>
      <div className={classnames(hideAddress ? 'hidden' : 'ml-2 leading-5')}>
        <div className='hidden sm:block'>{abbreviate(addr, 6)}</div>
        <div className='block sm:hidden'>{abbreviate(addr)}</div>
      </div>
    </Button>
  )
}