import React from 'react'
import { useExtensions } from '@mesonfi/extensions/react'
import { useCustodians } from '@mesonfi/custodians/react'

import CentralCardWithSideInfo from 'components/common/Card/CentralCardWithSideInfo'
import IntroRegion from 'components/common/Card/IntroRegion'
import Card from 'components/common/Card'
import Button from 'components/common/Button'

import ShareButton from './ShareButton'
import CardBodyTransfer from './CardBody/CardBodyTransfer'
import CardBodyEdit from './CardBody/CardBodyEdit'
import Icon from 'components/icons'
import { abbreviate } from 'lib'
import classnames from 'classnames'

export default function CardTransfer ({ to: initialTo, matchExt }) {
  const { extensions } = useExtensions()

  const [to, setTo] = React.useState(initialTo)
  const [editing, setEditing] = React.useState(false)
  const [modified, setModified] = React.useState(false)

  const onUpdateEditing = React.useCallback(value => {
    if (editing && modified) {
      if (!window.confirm('You have unsaved changes. Discard?')) {
        return
      }
      setModified(false)
    }
    if (value) {
      if (extensions.currentExt?.id === matchExt) {
        setEditing(true)
        return
      }
      extensions.connect(undefined, undefined, matchExt)
        .then(() => setEditing(true))
    } else {
      setEditing(false)
    }
  }, [extensions, editing, modified, matchExt])

  const onSubmitted = React.useCallback(newTo => {
    if (newTo) {
      setTo(newTo)
    }
    setEditing(false)
    setModified(false)
  }, [])

  const body = editing
    ? <CardBodyEdit
        to={to}
        setTo={setTo}
        setModified={setModified}
        onSubmitted={onSubmitted}
      />
    : <CardBodyTransfer to={to} />

  return (
    <CentralCardWithSideInfo>
      <div className='relative'>
        <CardTransferTitle
          isOwner={!!matchExt}
          extId={matchExt}
          editing={editing}
          addr={to.addr}
          onUpdate={onUpdateEditing}
        />
        <Card bg='pos2' className='p-3 xs:p-4 md:p-6 text-primary'>
          <div className='flex flex-row justify-between px-1 xs:px-0'>
          {
            !editing &&
            <>
              <div className='font-semibold'>Transfer to</div>
              <ShareButton to={to} />
            </>
          }
          </div>
          {body}
        </Card>
      </div>
      <IntroRegion
        networkId={to.networkId}
        token={to.tokens[0]}
        // side='How to make transfer with ALLsTo?'
        // steps={steps}
      >
        <Button
          as='a'
          type='transparent'
          size='xs'
          className='text-sm'
          href='/'
          target='_blank'
          rel='noreferrer'
        >Create My Link</Button>
      </IntroRegion>
    </CentralCardWithSideInfo>
  )
}

function CardTransferTitle ({ extId, addr, isOwner, editing, onUpdate }) {
  const [extIcon, setExtIcon] = React.useState('')
  const { extensions } = useExtensions()
  const { custodians } = useCustodians()

  React.useEffect(() => {
    let ext = extensions._cache.get(extId)

    if (!ext) {
      ext = custodians?.getService(extId)
    }

    if (ext) {
      setExtIcon(ext.icon)
    }
  }, [extensions, extId])

  if (isOwner) {
    return (
      <div className={classnames('relative z-10 flex text-primary items-center mb-2', !editing && 'justify-between')}>
      {
        editing
        ? <div className='font-semibold'>
            <span className='cursor-pointer inline-block w-7 h-7 rounded-full p-[7px] mr-3 bg-primary/20 hover:bg-primary/30' onClick={() => onUpdate(false)}>
              <Icon type='left-arrow' />
            </span>Edit My Page
          </div>
        : <>
            <div className='flex flex-col'>
              <span className='text-base font-semibold' onClick={() => onUpdate(false)}>
                My Page
              </span>
              <div className='flex'>
                <span className='inline-block mr-1 box-sizing w-4 h-4 p-[2px] rounded-full bg-white'>
                  {
                    extIcon && <img className='w-full h-full' src={extIcon} />
                  }
                </span>
                <span className='text-sm'>{abbreviate(addr, 9)}</span>
              </div>
            </div>
            <Button
              size='xs'
              type='primary'
              className='text-white !py-0 !px-2'
              onClick={() => onUpdate(true)}
            >
              <span className='h-4 w-4 mr-2'><Icon type='edit' /></span>
              Edit
            </Button>
          </>
      }
      </div>
    )
  } else {
    return null
  }
}
