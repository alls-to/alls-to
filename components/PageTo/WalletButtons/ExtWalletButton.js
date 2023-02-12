import React from 'react'
import { useRouter } from 'next/router'

import { useExtStatus } from '@mesonfi/extensions/react'

import { abbreviate } from 'lib'

import ConnectedButton from 'components/common/ConnectedButton'
import { DropdownMenu } from 'components/common/Dropdown'
import Icon from 'components/icons'

import Avatar from '../CardBody/Avatar'

export default function ExtWalletButton ({ hideAddress, ext, toAddr, onExtAddress }) {
  const router = useRouter()
  const extStatus = useExtStatus(ext.id)
  const [accounts, setAccounts] = React.useState([])

  const connect = React.useCallback(() => ext.enable(), [ext])
  const disconnect = React.useCallback(() => ext.dispose(), [ext])

  React.useEffect(() => {
    ext.glimpse().then(setAccounts)
  }, [ext])

  const currentAddress = extStatus?.currentAccount?.address
  const matchTo = toAddr === currentAddress

  React.useEffect(() => {
    onExtAddress(ext.id, currentAddress)
  }, [onExtAddress, ext.id, currentAddress])

  const options = React.useMemo(() => {
    const options = []
    if (currentAddress) {
      options.push({
        text: <><div className='flex h-4 w-4 mr-2'><Icon type='open'/></div>Open My Link</>,
        onClick: () => router.push(`/${currentAddress}`)
      })
      options.push({
        text: <>
          <div className='flex h-4 w-4 mr-2'><Icon type='disconnect'/></div>Disconnect
        </>,
        onClick: disconnect
      })
    } else {
      options.push({
        text: <>
          <div className='flex h-4 w-4 mr-2'><Icon type='wallet'/></div>Connect
        </>,
        onClick: connect
      })
    }
    return options
  }, [router, currentAddress, connect, disconnect])

  return (
    <DropdownMenu
      placement='bottom-start'
      btn={<ConnectedButton hideAddress={hideAddress} icon={ext.icon} addr={currentAddress} />}
      options={options}
    >
      <ExtStatus ext={ext} extStatus={extStatus} />
    </DropdownMenu>
  )
}

function ExtStatus ({ ext, extStatus }) {
  let content
  if (extStatus?.currentAccount) {
    content = (
      <div className='flex flex-row items-center py-1.5'>
        <div className='w-8 h-8 rounded-full mr-2'>
          <Avatar diameter={32} addr={extStatus.currentAccount.hex} />
        </div>
        <div className='flex flex-col'>
          <div className='text-xs font-semibold mb-0.5'>{ext.name}</div>
          <div className='text-sm'>
            {abbreviate(extStatus.currentAccount.address, 6)}
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
