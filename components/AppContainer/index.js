import React from 'react'
import classnames from 'classnames'

import Toast from './Toast'

export default function AppContainer ({ className, children }) {
  return (
    <div className='relative h-full'>
      <div className={classnames('relative z-10 flex flex-col items-center h-full overflow-x-hidden', className)}>
        {children}
      </div>
      <Toast />
    </div>
  )
}