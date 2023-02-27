import React from 'react'
import classnames from 'classnames'
import { useRouter } from 'next/router'

import { useExtStatus } from '@mesonfi/extensions/react'

import { abbreviate } from 'lib'

import ConnectedButton from 'components/common/ConnectedButton'
import { DropdownMenu } from 'components/common/Dropdown'
import Icon from 'components/icons'

import Avatar from '../CardBody/Avatar'
import { showErrorToast } from 'lib/refs'
import { getProfileByAddr } from 'lib/api'

export default function ExtWalletButton ({ hideAddress, ext, m2Ext, onExtAddress }) {
  const router = useRouter()
  const _extStatus = useExtStatus(ext.id)
  const [accounts, setAccounts] = React.useState([])
  const [avatar, setAvatar] = React.useState(null)

  const m2Connected = (m2Ext.extId === ext.id) || m2Ext.supportedExts?.includes(ext.type)
  const extStatus = m2Connected ? m2Ext.extStatus : _extStatus

  const connect = React.useCallback(() => {
    if (m2Connected) {
      m2Ext.connect(ext.id)
    } else if (ext.notInstalled) {
      showErrorToast(new Error(`Please install ${ext.name}.`))
    } else {
      ext.enable()
    }
  }, [m2Connected, m2Ext, ext])

  const disconnect = React.useCallback(() => {
    if (m2Connected) {
      m2Ext.disconnect()
    } else {
      ext.dispose()
    }
  }, [m2Connected, m2Ext, ext])

  React.useEffect(() => {
    ext.glimpse().then(setAccounts)
  }, [ext])

  const currentAddress = extStatus?.currentAccount?.address
  // const matchTo = toAddr === currentAddress
  // React.useEffect(() => {
  //   if (matchTo) {
  //     onActive(ext)
  //   }
  // }, [ext, matchTo, onActive])

  const openMyPage = React.useCallback(address => {
    router.push(`/${address}`)
  //   onActive(ext)
  // }, [router, ext, onActive])
  }, [router])

  React.useEffect(() => {
    currentAddress && (async () => {
      const profile = await getProfileByAddr(currentAddress)
      setAvatar(profile?.avatar)
    })()
  }, [currentAddress])


  React.useEffect(() => {
    onExtAddress(ext.id, currentAddress)
  }, [onExtAddress, ext.id, currentAddress])

  const options = React.useMemo(() => {
    const options = []
    if (currentAddress) {
      options.push({
        text: <><div className='flex h-4 w-4 mr-2'><Icon type='open' /></div>Open My Page</>,
        onClick: () => openMyPage(currentAddress)
      })
      options.push({
        text: <>
          <div className='flex h-4 w-4 mr-2'><Icon type='disconnect' /></div>Disconnect
        </>,
        onClick: disconnect
      })
    } else {
      options.push({
        text: <>
          <div className='flex h-4 w-4 mr-2'><Icon type='wallet' /></div>Connect
        </>,
        onClick: connect
      })
    }
    return options
  }, [currentAddress, openMyPage, connect, disconnect])

  const btnClassName = classnames(
    'relative duration-300 ease-out',
    !hideAddress && currentAddress ? '!px-3' : 'group-hover:ml-0 -ml-6'
  )

  return (
    <DropdownMenu
      portal={false}
      className={m2Connected && 'order-last z-10'}
      placement='bottom-start'
      btn={
        <ConnectedButton
          hideAddress={hideAddress}
          icon={ext.icon}
          addr={currentAddress}
          className={btnClassName}
        />
      }
      options={options}
    >
      <ExtStatus avatar={avatar} ext={ext} extStatus={extStatus} />
    </DropdownMenu>
  )
}

function ExtStatus ({ avatar, ext, extStatus }) {
  let content
  if (extStatus?.currentAccount) {
    content = (
      <div className='flex flex-row items-center py-1.5'>
        <div className='w-8 h-8 rounded-full overflow-hidden mr-2'>
          <Avatar url={avatar} diameter={32} addr={extStatus.currentAccount.hex} />
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
