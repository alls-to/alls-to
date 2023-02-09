import React from 'react'
import { useRouter } from 'next/router'

import { abbreviate } from 'lib'

import ConnectedButton from 'components/common/ConnectedButton'
import { DropdownMenu } from 'components/common/Dropdown'
import Icon from 'components/icons'

import Avatar from '../CardBody/Avatar'

export default function ExtWalletButton ({ hideAddress, ext }) {
  const router = useRouter()
  const [accounts, setAccounts] = React.useState([])

  React.useEffect(() => {
    ext.glimpse().then(setAccounts)
  }, [ext])

  const options = React.useMemo(() => {
    const options = []
    if (ext.currentAccount) {
      options.push({
        text: <><div className='flex h-4 w-4 mr-2'><Icon type='open'/></div>Open My Link</>,
        onClick: () => router.push(`/${ext.currentAccount.address}`)
      })
      options.push({
        text: <><div className='flex h-4 w-4 mr-2'><Icon type='edit'/></div>Edit My Page</>,
        onClick: () => router.push(`/${ext.currentAccount.address}`)
      })
      options.push({
        text: <>
          <div className='flex h-4 w-4 mr-2'><Icon type='disconnect'/></div>Disconnect
        </>,
        onClick: () => {}
      })
    } else {
      options.push({
        text: <>
          <div className='flex h-4 w-4 mr-2'><Icon type='wallet'/></div>Connect
        </>,
        onClick: () => {}
      })
    }
    return options
  }, [router, ext.currentAccount])

  return (
    <DropdownMenu
      placement='bottom-start'
      btn={<ConnectedButton hideAddress={hideAddress} icon={ext.icon} addr={ext.currentAccount?.address} />}
      options={options}
    >
      <ExtStatus ext={ext} />
    </DropdownMenu>
  )
}

function ExtStatus ({ ext }) {
  let content
  if (ext.currentAccount) {
    content = (
      <div className='flex flex-row items-center py-1.5'>
        <div className='w-8 h-8 rounded-full mr-2'>
          <Avatar diameter={32} addr={ext.currentAccount.hex} />
        </div>
        <div className='flex flex-col'>
          <div className='text-xs font-semibold mb-0.5'>{ext.name}</div>
          <div className='text-sm'>
            {abbreviate(ext.currentAccount.address, 6)}
          </div>
        </div>
      </div>
    )
  } else {
    content = <div className='py-1 text-xs font-semibold'>{ext.name}</div>
  }
  
  return (
    <div className='w-full px-2'>
      {content}
      <div className='bg-primary/30 h-px w-full my-1' />
    </div>
  )
}
