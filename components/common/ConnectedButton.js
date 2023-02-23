import classnames from 'classnames'

import { abbreviate } from 'lib'

import Button from './Button'

export default function ConnectedButton ({ hideAddress, icon, addr = '', className }) {
  return (
    <Button size='sm' type='white' className={classnames('hover:bg-primary/10 rounded-full relative group/btn duration-300 ease-out', !hideAddress && addr ? 'px-3' :'!px-2 group-hover:ml-0 -ml-6', className)}>
      <div className={classnames('w-5 h-5')}>
        <img alt='' crossOrigin='anonymous' className={classnames('w-5 h-5 overflow-hidden', !addr && 'filter-gray')} src={icon} />
      </div>
      <div className={classnames(hideAddress || !addr ? 'hidden' : 'ml-2 leading-5')}>
        <div className='hidden sm:block'>{abbreviate(addr, 6)}</div>
        <div className='block sm:hidden'>{abbreviate(addr)}</div>
      </div>
    </Button>
  )
}