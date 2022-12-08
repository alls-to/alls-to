import React from 'react'
import presets from '@mesonfi/presets'

export default function ForSender ({ to }) {
  const uid = to.uid || to.address

  return (
    <div className='w-80 flex flex-col mt-12 gap-2'>
      <span className='cursor-pointer text-indigo-600 hover:underline'>
        https://alls.to/{uid}
      </span>
      
      <div>Avatar: {to.avatar}</div>
      <div>to {to.name}</div>
      <div className='text-gray-500 text-xs'>{to.address}</div>
      <div className='text-gray-500'>{to.desc}</div>
      <div>{presets.getNetwork(to.networkId).name}</div>
      <div>{to.tokens.join(';')}</div>
    </div>
  )
}