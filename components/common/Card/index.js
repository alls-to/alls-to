import React from 'react'
import classnames from 'classnames'

import styles from './styles.module.css'

const bubbles = {
  pos1: ['left-[96px] top-[-135px]', 'left-[-76px] top-[346px]'],
  pos2: ['left-[240px] top-[-135px]', 'left-[-120px] top-[400px]']
}

export default function Card ({ className, children, bg = 'pos1' }) {
  return (
    <div className='relative'>
      <div className='absolute inset-0 z-0'>
        <div className={classnames(bubbles[bg][0], styles.bubble_shadow_1)} />
        <div className={classnames(bubbles[bg][0], styles.bubble_1)} />
        <div className={classnames(bubbles[bg][1], styles.bubble_shadow_2)} />
        <div className={classnames(bubbles[bg][1], styles.bubble_2)} />
      </div>
      <div className={classnames(
        'flex flex-col max-w-full border-[1.5px] border-white/60 bg-white/60 rounded-2xl backdrop-blur-3xl p-6 md:p-8 shadow-lg',
        className
      )}>
        {children}
      </div>
    </div>
  )
}