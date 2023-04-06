import React, { Fragment, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Button from 'components/common/Button'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

const RewardModal = (_, ref) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [rewardData, setRewardData] = React.useState()

  React.useImperativeHandle(ref, () => {
    return {
      open: (data) => {
        const status = localStorage.getItem('reward_modal_state')
        if (!status) {
          setRewardData(data)
          localStorage.setItem('reward_modal_state', 'opened')
          setIsOpen(true)
        }
      }
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
              <Dialog.Panel
                className='w-[360px] max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <div className='text-center'>
                  <img alt='AllsTo Reward' className='inline-block max-w-[140px]' src='/static/award.png' />
                </div>
                <div className='text-center text-primary mt-4 mb-10'>
                  <h3 className='font-bold mb-2'>Congratulations!</h3>
                  {
                    rewardData?.mint_hash ?
                      <p className='text-sm text-left'>
                        You just created an ALLsTo link successfully, and got a reward
                        of <b>500 $vALS</b>.
                      </p> :
                      <div className='text-sm text-left'>
                        <p className='mb-2'>
                          You just created an ALLsTo link successfully.
                          The reward of <b>500 $vALS</b> wil be sent to your address in 10 minutes.
                        </p>
                        <p>
                          Go to <a rel='noreferrer' href={publicRuntimeConfig.DISCORD_LINK} target='_blank'><b>ALLsTo’s discord</b></a> for more info.
                        </p>
                      </div>
                  }

                </div>
                <div className='flex flex-1 w-full mt-4 gap-4'>
                  {
                    rewardData?.mint_hash ?
                      <Button type='primary' className='h-12 w-full' onClick={() => setIsOpen(false)}>
                        OK
                      </Button> :
                      <>
                        <Button type='transparent' className='w-1/2 h-12' onClick={() => setIsOpen(false)}>
                          CANCEL
                        </Button>
                        <Button type='primary' className='w-1/2 h-12' onClick={() => window.open(publicRuntimeConfig.DISCORD_LINK, '_blank')}>
                          DISCORD
                        </Button>
                      </>
                  }
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default React.forwardRef(RewardModal)
