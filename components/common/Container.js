import React from 'react'
import classnames from 'classnames'

export default function Container ({ bg, bgClassName, className, children }) {
  return (
    <div className='relative h-full'>
      <div
        className={classnames('absolute inset-0 bg-cover bg-no-repeat', bgClassName)}
        style={bg && { backgroundImage: `url(${bg.src})` }}
      />
      <div className={classnames('relative flex flex-col items-center h-full overflow-x-hidden', className)}>
        {children}
      </div>
    </div>
  )
}