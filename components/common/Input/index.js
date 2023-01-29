import React from 'react'
import classnames from 'classnames'
import debounce from 'lodash/debounce'

const defaultInputClassName = 'w-full rounded-2xl bg-glass-200 placeholder-gray-400/60 p-4 font-semibold text-sm border border-transparent focus:border-primary focus:ring-0'

const getEl = type => {
  if (['textarea', 'select'].includes(type)) {
    return type
  }
  return 'input'
}

const getDefaultClassNames = type => {
  if (type === 'textarea') {
    return `${defaultInputClassName} block h-20 resize-none pr-2 pb-2`
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
    let currentRequest = true
    validator(checkingValue)
      .then(validated => {
        if (!currentRequest) {
          return
        }
        setChecking(false)
        setError()
        setValidated(validated)
      })
      .catch(err => {
        if (!currentRequest) {
          return
        }
        setChecking(false)
        setError(err)
      })
    return () => {
      currentRequest = false
    }
  }, [validator, checkingValue])

  const onInputChange = React.useCallback(evt => {
    const value = evt.target.value
    onChange(value)
    checkValue(value)
  }, [onChange, checkValue])

  const validInfo = React.useMemo(() => {
    if (disabled) {
      return
    }
    if (checking) {
      return {
        message: <span className='text-primary'>Checking...</span>
      }
    } else if (error) {
      return {
        message: <span className='text-red'>{error.message}</span>,
        className: '!border-red !focus:border-red'
      }
    } else if (validated) {
      return {
        message: typeof validated === 'string' && <span className='text-green'>{validated}</span>,
      }
    }
  }, [disabled, checking, error, validated])

  return (
    <div className={classnames('relative text-sm', className)}>
      {
        label &&
        <label htmlFor={id} className='block text-primary h-4.5 mb-1'>
          {label}
        </label>
      }
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
      {validInfo && <div className='mt-1 ml-4 text-xs'>{validInfo.message}</div>}
      {!validInfo && underline && <div className='mt-1 ml-4 text-xs text-primary'>{underline}</div>}
    </div>
  )
}