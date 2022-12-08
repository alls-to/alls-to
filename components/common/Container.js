import React from 'react'
import classnames from 'classnames'

export default function Container ({ bg, className, style, children }) {
  return (
    <div
      className={classnames(
        'flex flex-col items-center h-full overflow-auto',
        'bg-cover bg-top bg-no-repeat',
        className
      )}
      style={{ backgroundImage: `url(${bg.src})`, ...style }}
    >
      {children}
    </div>
  )
}