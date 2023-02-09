import React from 'react'

import { Menu } from '@headlessui/react'
import { Float } from '@headlessui-float/react'

function Dropdown({
  className,
  btn,
  placement = 'bottom-end',
  disabled,
  children,
}, ref) {
  // React.useEffect(() => setShow(false), [])
  // React.useImperativeHandle(ref, () => ({
  //   close: () => setShow(false)
  // }))

  // const [show, setShow] = React.useState(false)
  // const toggle = () => setShow(!show)

  return (
    <Menu as='div' className={className}>
      <Float
        portal
        placement={placement}
        offset={4}
        shift={{ padding: 32 }}
        // flip
        zIndex={20}
        enter='transition ease-out duration-100'
        enterFrom='opacity-0 scale-90'
        enterTo='opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='opacity-100 scale-100'
        leaveTo='opacity-0 scale-90'
        tailwindcssOriginClass
      >
        <Menu.Button>
          {btn}
        </Menu.Button>
        <Menu.Items>
          {children}
        </Menu.Items>
      </Float>
    </Menu>
  )
}

// onClick={() => !disabled && toggle()}

{/* <div
  className='fixed inset-0 z-20 overflow-y-auto no-scrollbar'
  onClick={() => setShow(false)}
>
<div className='w-full h-[calc(100%+1px)]' />
</div> */}

export function DropdownMenu ({ className, btn, placement, options = [], children }) {
  return (
    <Dropdown className={className} btn={btn} placement={placement}>
      <div className='flex flex-col min-w-[200px] p-2 bg-white rounded-xl focus:outline-none shadow-xl'>
        {children}
        <div className='flex flex-col gap-1'>
          {options.map((props, i) => <DropdownItem key={`item-${i}`} {...props} />)}
        </div>
      </div>
    </Dropdown>
  )
}

function DropdownItem ({ text, ...props }) {
  return (
    <Menu.Item
      as='div'
      className='flex flex-row items-center px-2 py-1.5 rounded-lg hover:bg-primary/10 cursor-pointer text-sm text-primary'
      {...props}
    >
      {text}
    </Menu.Item>
  )
}

export default React.forwardRef(Dropdown)
