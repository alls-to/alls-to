import React from 'react'

export default function Header ({ children }) {
  return (
    <div className='w-full flex flex-row items-center justify-between mt-5 pl-8 pr-9 h-10'>
      <div className='flex bg-gray-400 text-white h-[30px] w-[120px] font-light items-center justify-center'>ALLS.TO LOGO</div>
      <div className='flex flex-row items-center gap-2.5'>
        {children}
      </div>
    </div>
  )
}