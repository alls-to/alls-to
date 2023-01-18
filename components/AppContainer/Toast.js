import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Transition } from '@headlessui/react'
import Icon from '../icons'
import refs from 'lib/refs'

const SHORT_DURATION = 2500
const LONG_DURATION = 8000
const INFINITY_DURATION = 86400_000 // 24h
const DELAY_TO_CLOSE = 1000

const ICONS = {
  success: <Icon type='icon-check' />,
  warning: <Icon type='icon-warning' />,
  error: <Icon type='icon-error' />,
  info: <Icon type='icon-info' />,
}

export function ToastCard ({ title, subtitle, type, onClose, withCloseButton, onMouseEnter, onMouseLeave }) {
  return (
    <Transition
      appear
      show
      as={Fragment}
      enter='transition duration-300'
      enterFrom='opacity-0 -translate-y-[56px]'
      enterTo='opacity-100 translate-y-0'
      leave='transition duration-300'
      leaveFrom='opacity-100'
      leaveTo='opacity-0'
      // afterLeave={onClose}
    >
      <div
        className='flex flex-col w-60 bg-white rounded-xl shadow-lg py-2 px-3 text-primary'
        onClick={e => e.stopPropagation()}
        onMouseDown={e => e.stopPropagation()}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className='flex justify-between'>
          <div className='flex items-center'>
            <div className='w-5 h-5 rounded-full mr-2'>
              {ICONS[type]}
            </div>
            <span className='overflow-hidden break-words text-sm leading-[20px]'>
              {title}
            </span>
          </div>
          {withCloseButton && 'x'}
        </div>
        {
          subtitle &&
          <div className='mt-1 ml-7 text-sm text-justify text-primary/50'>
            {subtitle}
          </div>
        }
      </div>

    </Transition>
  )
}

ToastCard.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  type: PropTypes.oneOf(['warning', 'success', 'error', 'info']),
  show: PropTypes.bool,
  onClose: PropTypes.func,
  afterClosed: PropTypes.func
}

function useTimedToasts () {
  const toastId = React.useRef(1)
  const [toasts, setToasts] = React.useState([])
  const timers = React.useMemo(() => new Map(), [])

  const closeToast = React.useCallback(id => {
    if (timers.has(id)) {
      clearTimeout(timers.get(id))
      timers.delete(id)
    }
    setToasts(toasts => toasts.filter(t => t.id !== id))
  }, [timers, setToasts])

  const addToast = React.useCallback(opt => {
    const id = toastId.current++
    const {
      title,
      subtitle = '',
      type = 'success',
      withCloseButton = false,
      sticky = false,
      clearPrevAll = false,
    } = opt

    const delayToClose = sticky
      ? INFINITY_DURATION
      : withCloseButton ? LONG_DURATION : SHORT_DURATION
    const h = setTimeout(() => closeToast(id), delayToClose)
    timers.set(id, h)

    const toast = { id, type, title, subtitle, withCloseButton, sticky }
    if (!sticky) {
      toast.onMouseEnter = () => {
        if (timers.has(id)) {
          clearTimeout(h)
          timers.set(id, -1)
        }
      }
      toast.onMouseLeave = () => {
        if (timers.has(id)) {
          const h = setTimeout(() => closeToast(id), DELAY_TO_CLOSE)
          timers.set(id, h)
        }
      }
    }

    if (clearPrevAll) {
      setToasts(toast)
    } else {
      setToasts(prev => [...prev, toast])
    }

    return id
  }, [timers, closeToast])

  return {toasts, addToast, closeToast }
}

export default function Toast () {
  const { toasts, addToast, closeToast } = useTimedToasts()

  React.useImperativeHandle(refs.toast, () => ({
    show: addToast,
    close: closeToast
  }))

  return (
    <div className='absolute z-[100] top-5 inset-x-0 mx-auto flex flex-col w-60 gap-1.5'>
    {
      toasts.map(toast => (
        <ToastCard key={toast.id} {...toast} onClose={() => closeToast(toast.id)} />
      ))
    }
    </div>
  )
}
