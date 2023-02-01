import { abbreviate } from 'lib'

import Button from './Button'

export default function ConnectedButton ({ icon, addr }) {
  if (!addr) {
    return null
  }
  return (
    <Button size='sm' type='white'>
      <div className='w-7 h-7 p-1 mr-2'>
        <img alt='' crossOrigin='anonymous' className='w-5 h-5' src={icon} />
      </div>
      <div className='hidden sm:block'>{abbreviate(addr, 6)}</div>
      <div className='block sm:hidden'>{abbreviate(addr)}</div>
    </Button>
  )
}