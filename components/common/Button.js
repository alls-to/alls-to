import React from 'react'
import classnames from 'classnames'

export default function Button ({ className, onClick, children }) {
  return (
    <div
      className={classnames(
        'p-3 pl-4 flex items-center bg-glass-200 hover:bg-glass-300 cursor-pointer',
        'border-none border-glass-200 rounded-xl text-base font-bold',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}