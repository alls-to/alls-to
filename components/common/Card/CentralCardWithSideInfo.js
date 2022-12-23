import classnames from 'classnames'

import IntroRegion from './IntroRegion'

export default function CentralCardWithSideInfo ({ children, side, steps, button }) {
  return (
    <div className={classnames(
      'w-full flex flex-col items-center sm:flex-row sm:items-end',
      'mt-4 mb-6 sm:mb-12 px-2 xs:px-4 md:px-12'
    )}>
      <div className='flex-1' />
      <div className='max-w-full w-[460px] px-4'>
        {children}
      </div>
      <div className='mt-12 sm:mt-0 mb-6 mx-4 flex-1 flex flex-col items-end'>
        <IntroRegion side={side} steps={steps} button={button} />
      </div>
    </div>
  )
}

