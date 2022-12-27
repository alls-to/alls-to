import React from 'react'
import classnames from 'classnames'
import debounce from 'lodash/debounce'

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
  value, onChange,
  validator,
  disabled = false, placeholder = '', maxLength, underline,
  options = [],
  children
}) {
  const [checkingValue, setCheckingValue] = React.useState()
  const [checking, setChecking] = React.useState(false)
  const [validated, setValidated] = React.useState()
  const [error, setError] = React.useState()

  const checkValue = React.useMemo(() => debounce(setCheckingValue, 300), [])

  React.useEffect(() => {
    if (!validator) {
      return
    }
    setChecking(true)
    validator(checkingValue)
      .then(validated => {
        setChecking(false)
        setError()
        setValidated(validated)
      })
      .catch(err => {
        setChecking(false)
        setError(err)
      })
  }, [validator, checkingValue])

  const onInputChange = React.useCallback(evt => {
    const value = evt.target.value
    onChange(value)
    checkValue(value)
  }, [onChange, checkValue])

  const validInfo = React.useMemo(() => {
    if (checking) {
      return {
        message: <span className='text-gray-400'>Checking...</span>
      }
    } else if (error) {
      return {
        message: <span className='text-red'>{error.message}</span>,
        className: '!border-red !focus:border-red'
      }
    } else if (validated) {
      return {
        message: typeof validated === 'string' && <span className='text-green'>{validated}</span>,
        className: '!border-green !focus:border-green'
      }
    }
  }, [checking, error, validated])

  return (
    <div className={classnames('relative text-sm', className)}>
      <label htmlFor={id} className='block text-primary h-4.5'>
        {label}
      </label>
      {React.createElement(
        getEl(type),
        {
          id, name: id, type,
          className: classnames(getDefaultClassNames(type), validInfo?.className, inputClassName),
          value, onChange: onInputChange,
          disabled, placeholder, maxLength,
        },
        type === 'select'
          ? options.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)
          : undefined
      )}
      {children}
      {validInfo && <div className='ml-4 mt-1 text-xs'>{validInfo.message}</div>}
      {underline && <div className='ml-4 mt-1 text-xs text-primary'>{underline}</div>}
    </div>
  )
}