import React from 'react'
import classnames from 'classnames'

import styles from './styles.module.css'

function CardBackground1 () {
  return (
    <div className='absolute inset-0 z-0'>
      <div className={classnames('left-[96px] top-[-135px]', styles.bubble_1)} />
      <div className={classnames('left-[96px] top-[-135px]', styles.bubble_shadow_1)} />
      <div className={classnames('left-[-76px] top-[346px]', styles.bubble_2)} />
      <div className={classnames('left-[-76px] top-[346px]', styles.bubble_shadow_2)} />
    </div>
  )
}

function CardBackground2 () {
  return (
    <div className='absolute w-[2400px] h-[max(100vh,calc(100%+124px))] -left-[1000px] -top-[76px] overflow-visible sm:overflow-hidden z-0'>
      <div className='relative left-[1000px] top-[76px]'>
        <div className={classnames('left-[240px] top-[-135px]', styles.bubble_1)} />
        <div className={classnames('left-[240px] top-[-135px]', styles.bubble_shadow_1)} />
        <div className={classnames('left-[-120px] top-[400px]', styles.bubble_2)} />
        <div className={classnames('left-[-120px] top-[400px]', styles.bubble_shadow_2)} />
        <div className={classnames('left-[-350px] top-[-30px]', styles.bubble_3)} />
        <div className={classnames('left-[340px] top-[175px]', styles.bubble_4)} />
      </div>
    </div>
  )
}

const backgrounds = {
  pos1: CardBackground1,
  pos2: CardBackground2
}

export default function Card ({ className, children, bg = 'pos1' }) {
  return (
    <div className='w-full'>
      {backgrounds[bg]?.()}
      <dialog className={classnames(
        'relative flex flex-col w-full border-[1.5px] border-white/60 bg-white/60 rounded-2xl backdrop-blur-3xl shadow-lg',
        'overflow-hidden',
        className
      )}>
        {children}
      </dialog>
    </div>
  )
}
