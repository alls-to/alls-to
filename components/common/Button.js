import React from 'react'
import classnames from 'classnames'

export default function Button ({ className, onClick, children }) {
  return (
    <div
      className={classnames(
        'p-3 pl-4 flex items-center hover:bg-gray-100/25 cursor-pointer',
        'border border-white rounded-xl text-base font-bold',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}