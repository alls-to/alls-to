import classnames from 'classnames'

export default function CentralCardWithSideInfo ({ children }) {
  return (
    <div className={classnames(
      'w-full relative flex flex-col items-center xl:flex-row xl:items-center',
      'mt-4 mb-6 sm:mb-12 px-0 xs:px-2 sm:px-4 md:px-12'
    )}>
      <div className='flex-1 justify-center'>
        <div className='relative max-w-[460px] w-full mx-auto px-3 xs:px-4'>
          {children[0]}
        </div>
      </div>
      <div className='mt-12 xl:mt-0 mb-6 mx-4 flex-0 flex flex-col items-end xl:absolute right-12 bottom-0'>
        {children[1]}
      </div>
    </div>
  )
}
