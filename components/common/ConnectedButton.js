import { abbreviate } from 'lib'

import Button from './Button'

export default function ConnectedButton ({ browserExt }) {
  if (!browserExt?.currentAccount) {
    return null
  }
  return (
    <Button size='sm' type='white'>
      <div className='w-7 h-7 p-1 mr-2'>
        <img alt={browserExt.name} crossOrigin='anonymous' className='w-5 h-5' src={browserExt.ext.icon} />
      </div>
      <div className='hidden sm:block'>{abbreviate(browserExt?.currentAccount.address, 6)}</div>
      <div className='block sm:hidden'>{abbreviate(browserExt?.currentAccount.address)}</div>
    </Button>
  )
}