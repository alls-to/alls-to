import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Button from 'components/common/Button'

const ValidatorModal = React.forwardRef(({ to, onNext }, ref) => {
  let [isOpen, setIsOpen] = React.useState(false)
  const [value, setValue] = React.useState('')
  const answer = to.key?.slice(0, 1)
  const restKeyStr = to.key?.slice(1, to.key.length)

  const handleChange = (event) => {
    setValue(event.target.value.toLowerCase())
  }

  const handleConfirm = () => {
    if (value === answer) {
      onNext()
    }
  }

  React.useImperativeHandle(ref, () => {
    return {
      open() {
        setIsOpen(true)
      },
      close() {
        setIsOpen(false)
      },
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
                <div className='my-10 flex justify-center items-center font-bold text-primary text-xl'>
                  <input onChange={handleChange} value={value} autoCapitalize='off' className='w-8 h-8 border text-center border-primary/40 rounded-lg mr-1' /> { restKeyStr }
                </div>
                <div className='flex flex-1 w-full mt-4 gap-4'>
                  <Button type='transparent' className='w-1/2 h-12' onClick={() => setIsOpen(false)}>
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
})

export default ValidatorModal
