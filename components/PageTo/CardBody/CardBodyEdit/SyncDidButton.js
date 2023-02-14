import React from 'react'

import * as api from 'lib/api'
import { showSuccessToast, showInfoToast, showErrorToast } from 'lib/refs'

import { DropdownMenu } from 'components/common/Dropdown'
import Button from 'components/common/Button'
import Icon from 'components/icons'
import { DIDs, getNameById } from 'lib/did'

export default function SyncDidButton ({ to, onSynced, accountToken }) {
  const didName = getNameById(to.did)

  const sync = React.useCallback(async didItem => {
    try {
      const synced = await api.syncDid(to.key, didItem.id, accountToken)
      showSuccessToast({ message: `Synced with ${didItem.name} Profile!` })
      onSynced(synced)
    } catch (e) {
      console.warn(e)
      showErrorToast(new Error(`No ${didItem.name} profile found for the current address. Please go to ${didItem.domain} to create one.`))
    }
  }, [to.key, onSynced, accountToken])

  const unsync = React.useCallback(async () => {
    const name = getNameById(to.did)
    await api.unsyncDid(to.key, accountToken)
    showInfoToast({ message: `Unsynced with ${name}.` })
    onSynced()
  }, [to.key, onSynced, accountToken])

  let btn
  let options
  let iconType = to.did
  if(to.did === 'dotbit') {
    iconType = 'dotbit-badge'
  }

  if (to.did) {
    btn = (
      <Button size='xs' type='pure' className='!text-sm !font-normal !py-1.5'>
        Synced with
        <div className='w-4 h-4 mx-1'><Icon type={iconType} /></div>
        <div className='font-semibold'>{didName}</div>
      </Button>
    )
    options = [{
      text: <><div className='flex h-4 w-4 mr-2'><Icon type='unsync' /></div>Unsync</>,
      onClick: unsync
    }]
  } else {
    btn = (
      <Button size='xs' type='pure' className='!text-sm !font-normal !py-1.5'>
        Sync with DID
      </Button>
    )
    options = DIDs.map(item => ({
      text: <><div className='flex h-4 w-4 mr-2'><Icon type={item.id} /></div>{item.fullName}</>,
      onClick: () => sync(item)
    }))
  }

  return <DropdownMenu className='-mr-3' btn={btn} options={options} />
}
