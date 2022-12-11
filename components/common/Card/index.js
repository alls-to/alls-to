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
    <div className='absolute inset-0 z-0'>
      <div className={classnames('left-[240px] top-[-135px]', styles.bubble_1)} />
      <div className={classnames('left-[240px] top-[-135px]', styles.bubble_shadow_1)} />
      <div className={classnames('left-[-120px] top-[400px]', styles.bubble_2)} />
      <div className={classnames('left-[-120px] top-[400px]', styles.bubble_shadow_2)} />
      <div className={classnames('left-[-350px] top-[-30px]', styles.bubble_3)} />
      <div className={classnames('left-[340px] top-[175px]', styles.bubble_4)} />
    </div>
  )
}

const backgrounds = {
  pos1: CardBackground1,
  pos2: CardBackground2
}

export default function Card ({ className, children, bg = 'pos1' }) {
  return (
    <div className='relative'>
      {backgrounds[bg]()}
      <dialog className={classnames(
        'relative flex flex-col max-w-full border-[1.5px] border-white/60 bg-white/60 rounded-2xl backdrop-blur-3xl p-6 md:p-8 shadow-lg',
        className
      )}>
        {children}
      </dialog>
    </div>
  )
}

<div className={classnames('left-[-272px] top-[-110px]', styles.bubble2)} />
