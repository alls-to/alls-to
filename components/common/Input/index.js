import React from 'react'
import classnames from 'classnames'

const defaultInputClassName = 'mt-1 w-full rounded-2xl bg-glass-200 placeholder-gray-400/60 p-4 font-semibold text-sm border border-transparent focus:border-primary focus:ring-0'

const getEl = type => {
  if (['textarea', 'select'].includes(type)) {
    return type
  }
  return 'input'
}

const getDefaultClassNames = type => {
  if (type === 'textarea') {
    return `${defaultInputClassName} h-20 resize-none pr-2 pb-2`
  }
  return defaultInputClassName
}

export default function Input ({
  id, label, type = 'text',
  className, inputClassName,
  value, onChange, disabled = false, placeholder = '', maxLength, underline,
  options = [],
  children
}) {
  return (
    <div className={classnames('relative text-sm', className)}>
      <label htmlFor={id} className='block text-primary h-4.5'>
        {label}
      </label>
      {React.createElement(
        getEl(type),
        {
          id, name: id, type,
          className: classnames(getDefaultClassNames(type), inputClassName),
          value, disabled, placeholder, maxLength,
          onChange: evt => onChange(evt.target.value),
        },
        type === 'select'
          ? options.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)
          : undefined
      )}
      {children}
      {underline && <div className='ml-4 mt-1 text-xs text-primary'>{underline}</div>}
    </div>
  )
}