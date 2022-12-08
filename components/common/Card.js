import React from 'react'
import classnames from 'classnames'

export default function Card ({ className, children }) {
  return (
    <div className={classnames(
      'flex flex-col border border-white rounded-2xl bg-white/50 backdrop-blur-lg p-8 shadow-2xl',
      className
    )}>
      {children}
    </div>
  )
}