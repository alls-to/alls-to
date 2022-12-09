import React from 'react'
import classnames from 'classnames'

export default function Container ({ bg, bgClassName, children }) {
  return (
    <div className='relative h-full'>
      <div
        className={classnames('absolute inset-0 bg-cover bg-top bg-no-repeat', bgClassName)}
        style={{ backgroundImage: `url(${bg.src})` }}
      />
      <div className='relative flex flex-col items-center h-full overflow-auto'>
        {children}
      </div>
    </div>
  )
}