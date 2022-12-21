import React from 'react'
import classnames from 'classnames'

const DEFAULT_CLASSNAME = 'flex items-center justify-center cursor-pointer focus:outline-none'

const BTN_SIZES = {
  sm: 'px-3 py-1 text-sm rounded-lg',
  md: 'h-12 font-semibold rounded-xl',
  lg: 'p-3 pl-4 text-base font-bold rounded-xl',
  round: 'px-2 py-1 rounded-full text-sm font-semibold leading-none'
}

const BTN_TYPES = {
  default: 'bg-white hover:bg-primary/10 text-primary border border-primary',
  primary : 'bg-primary hover:bg-primary/90 text-white border border-primary',
  glass: 'bg-glass-200 hover:bg-glass-300 border-none border-glass-200',
  transparent: 'bg-transparent hover:bg-primary/10 text-primary border border-primary',
}

export default function Button ({ size = 'md', type = 'default', className, onClick, children, as, ...rest }) {
  const btnClassName = classnames(DEFAULT_CLASSNAME, BTN_SIZES[size], BTN_TYPES[type], className)
  
  if (as) {
    return React.createElement(as, { className: btnClassName, ...rest }, children)
  }
  return (
    <div className={btnClassName} onClick={onClick}>
      {children}
    </div>
  )
}
