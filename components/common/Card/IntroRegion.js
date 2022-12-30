import React from 'react'
import Card from 'components/common/Card'

export default function IntroRegion ({ side, steps = [], button }) {
  return (
    <div className='relative sm:w-[280px] text-sm'>
      <div className='font-medium'>What is Alls.To?</div>

      <div className='font-light mt-3'>
        Alls.to is a xxx.
        <Card bg='' className='mt-3 p-3'>
          A diagram introducing the process
        </Card>
      </div>

      {side && <div className='font-medium mt-6'>{side}</div>}
      <div className='ml-7 font-light'>
      {
        steps.map((step, i) => (
          <React.Fragment key={`key-${i}`}>
            <div className='mt-3 flex flex-row'>
              <div className='-ml-4 w-4'>{i+1}.</div>
              <div>{step.title}</div>
            </div>
            <div className='mt-1 text-primary/40'>{step.desc}</div>
          </React.Fragment>
        ))
      }
      </div>
      {button && <div className='mt-6 inline-block'>{button}</div>}
    </div>
  )
}
