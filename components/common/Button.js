import React from 'react'
import classnames from 'classnames'

const DEFAULT_CLASSNAME = 'flex items-center justify-center focus:outline-none'

const BTN_SIZES = {
  '2xs': 'px-2 py-0.5 text-base font-semibold rounded-lg !border-none',
  xs: 'px-3 py-1 text-base font-semibold rounded-lg',
  sm: 'px-3 py-2 text-base font-semibold rounded-xl',
  md: 'p-3 text-base font-semibold rounded-xl',
  lg: 'p-3 pl-4 text-base font-bold rounded-xl',
  round: 'px-2 py-1 rounded-full text-sm font-semibold leading-none'
}

const BTN_TYPES = {
  default: 'bg-white text-primary border border-primary',
  primary : 'bg-primary text-white border border-primary',
  white : 'bg-white text-primary border border-transparent shadow-lg',
  glass: 'bg-glass-200 border-none border-glass-200',
  transparent: 'bg-transparent text-primary border border-primary',
  pure: 'bg-transparent text-primary',
}

const BTN_TYPES_ON_HOVER = {
  default: 'hover:bg-primary/10',
  primary : 'hover:bg-primary/90',
  white: 'hover:bg-primary-100',
  glass: 'hover:bg-glass-300',
  transparent: 'hover:bg-primary/10',
  pure: 'hover:bg-primary/10'
}

const BTN_TYPES_DISABLED = {
  default: 'bg-white opacity-50',
  primary : 'opacity-50',
  glass: '',
  transparent: '',
  pure: ''
}

export default function Button ({ as, size = 'md', type = 'default', className, onClick, disabled, children, ...rest }) {
  const btnClassName = classnames(
    DEFAULT_CLASSNAME,
    disabled ? 'cursor-not-allowed' : 'cursor-pointer',
    BTN_SIZES[size],
    BTN_TYPES[type],
    disabled ? BTN_TYPES_DISABLED[type] : BTN_TYPES_ON_HOVER[type],
    className
  )
  
  if (as) {
    return React.createElement(as, { className: btnClassName, disabled, onClick, ...rest }, children)
  }
  return (
    <div className={btnClassName} onClick={disabled ? undefined : onClick}>
      {children}
    </div>
  )
}
