import React from 'react'

import * as api from 'lib/api'

import { DropdownMenu } from 'components/common/Dropdown'
import Button from 'components/common/Button'
import Icon from 'components/icons'

export default function SyncDidButton ({ to, onSynced, accountToken }) {
  const sync = React.useCallback(async did => {
    try {
      const synced = await api.syncDid(did, accountToken)
      onSynced(synced)
    } catch (e) {
      console.warn(e)
    }
  }, [onSynced, accountToken])

  const unsync = React.useCallback(async () => {
    await api.unsyncDid(accountToken)
    onSynced()
  }, [onSynced, accountToken])

  let btn
  let options
  if (to.did) {
    btn = (
      <Button size='xs' type='pure' className='!text-sm !font-normal !py-1.5'>
        Synced with
        <div className='w-4 h-4 mx-1'><Icon type={to.did} /></div>
        <div className='font-semibold'>Link3</div>
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
    options = [{
      text: <><div className='flex h-4 w-4 mr-2'><Icon type='cyberconnect' /></div>Link3 / CyberConnect</>,
      onClick: () => sync('cyberconnect')
    }]
  }

  return <DropdownMenu className='-mr-3' btn={btn} options={options} />
}
