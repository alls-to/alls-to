import React from 'react'
import classnames from 'classnames'

export default function Header ({ logoSrc, children }) {
  return (
    <div className='w-full flex flex-row items-center justify-between mt-5 pl-8 pr-9 h-10'>
      <a
        className={classnames(
          'flex bg-gray-400 text-white h-[30px] w-[120px] font-light items-center justify-center rounded-lg',
          logoSrc && 'cursor-pointer'
        )}
        href={logoSrc}
      >
        ALLS.TO LOGO
      </a>
      <div className='flex flex-row items-center gap-2.5'>
        {children}
      </div>
    </div>
  )
}