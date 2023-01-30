import React from 'react'

import CentralCardWithSideInfo from 'components/common/Card/CentralCardWithSideInfo'
import IntroRegion from 'components/common/Card/IntroRegion'
import Card from 'components/common/Card'
import Button from 'components/common/Button'

import ShareButton from './ShareButton'
import CardBodyTransfer from './CardBody/CardBodyTransfer'
import CardBodyEdit from './CardBody/CardBodyEdit'

export default function CardTransfer ({ to: initialTo, currentAddress }) {
  const [to, setTo] = React.useState(initialTo)
  const isOwner = to.address === currentAddress
  const [editing, setEditing] = React.useState(false)
  const [modified, setModified] = React.useState(false)

  const onUpdateEditing = React.useCallback(value => {
    if (editing && modified) {
      if (!window.confirm('You have unsaved changes. Discard?')) {
        return
      }
      setModified(false)
    }
    setEditing(value)
  }, [editing, modified])

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
      <Card bg='pos2' className='p-3 xs:p-4 md:p-6 text-primary'>
        <div className='flex flex-row justify-between px-1 xs:px-0'>
          <CardTransferTitle
            isOwner={isOwner}
            editing={editing}
            onUpdate={onUpdateEditing}
          />
          {!editing && <ShareButton to={to} />}
        </div>
        {body}
      </Card>
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

function CardTransferTitle ({ isOwner, editing, onUpdate }) {
  if (isOwner) {
    return (
      <div className='-my-1.5 -ml-2 flex p-1 rounded-xl bg-glass-200 gap-1'>
        <Button
          size='2xs'
          type={editing ? 'transparent' : 'primary'}
          onClick={() => onUpdate(false)}
        >
          My Page
        </Button>
        <Button
          size='2xs'
          type={editing ? 'primary' : 'transparent'}
          onClick={() => onUpdate(true)}
        >
          Edit
        </Button>
      </div>
    )
  } else {
    return <div className='font-semibold'>TRANSFER TO</div>
  }
}
