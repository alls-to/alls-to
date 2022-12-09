import React from 'react'
import classnames from 'classnames'

export default function Card ({ className, children }) {
  return (
    <div className={classnames(
      'flex flex-col border-[1.5px] border-white/60 bg-white/60 rounded-2xl backdrop-blur-3xl p-6 md:p-8 shadow-lg',
      className
    )}>
      {children}
    </div>
  )
}