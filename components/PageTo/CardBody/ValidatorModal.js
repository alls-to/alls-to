import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Button from 'components/common/Button'

const ValidatorModal = ({ to }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [value, setValue] = React.useState('')
  const [invalid, setInvalid] = React.useState(false)
  const [restHandleStr, setRestHandleStr] = React.useState('')
  const [answer, setAnswer] = React.useState('')
  const promiseRef = React.useRef()

  const handleChange = (event) => {
    setValue(event.target.value.toLowerCase())
  }

  const handleConfirm = () => {
    setInvalid(value !== '' && answer !== value)
    if (answer === value) {
      setIsOpen(false)
      setValue('')
      setInvalid(false)
      promiseRef.current.resolve(true)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    setValue('')
    setInvalid(false)
  }

  React.useImperativeHandle(ref, () => {
    return {
      openAndWaitCheck: async (handle) => new Promise((resolve, reject) => {
        setRestHandleStr(handle.slice(1, handle.length))
        setAnswer(handle.slice(0, 1))
        promiseRef.current = {
          resolve,
          reject
        }
        setIsOpen(true)
      })
    }
  }, [])

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-[360px] max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-md font-bold leading-6 text-primary'
                >
                  Confirm Payee Identity
                </Dialog.Title>
                <div className='mt-2'>
                  <p className='text-sm text-primary'>
                    Please complete payee’s full .bit account to ensure transfer is correct.
                  </p>
                </div>
                <div className='my-10'>
                  <div className='flex justify-center items-center font-bold text-primary text-xl'>
                    <input onChange={handleChange} value={value} autoCapitalize='off' className='inline-block w-8 h-8 border text-center border-primary/40 rounded-lg mr-1' />
                    {restHandleStr}
                  </div>
                  {
                    invalid && <div className='text-center text-sm text-red'>Input incorrect</div>
                  }
                </div>
                <div className='flex flex-1 w-full mt-4 gap-4'>
                  <Button type='transparent' className='w-1/2 h-12' onClick={handleCancel}>
                    CANCEL
                  </Button>
                  <Button type='primary' className='w-1/2 h-12' onClick={handleConfirm}>
                    CONFIRM
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default React.forwardRef(ValidatorModal)
