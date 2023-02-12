import React from 'react'
import classnames from 'classnames'
import Image from 'next/image'

export default function Header ({ logoSrc, children }) {
  return (
    <div className='relative z-20 w-full flex flex-row items-center justify-between mt-5 pl-4 pr-3 xs:px-6 sm:pl-8 sm:pr-9 h-10 shrink-0'>
      <a
        className={classnames(
          'flex h-[30px] w-[160px] items-center',
          logoSrc && 'cursor-pointer'
        )}
        href={logoSrc}
      >
        <Image alt='logo' width={28} height={28} src='/logo.svg' />
        <div className='ml-2 text-[20px] font-light text-primary'>ALLsTo</div>
      </a>
      <div className='flex flex-row items-center gap-2'>
        {children}
      </div>
    </div>
  )
}