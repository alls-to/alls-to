import React from 'react'

import Input from 'components/common/Input'
import Icon from 'components/icons'

import Avatar from '../Avatar'
import AvatarWrapper from '../Avatar/AvatarWrapper'
import AvatarUploader from '../Avatar/AvatarUploader'
import SocialButtons from '../SocialButtons'
import SyncDidButton from './SyncDidButton'
import LinkInput from './LinkInput'
import { DIDs } from 'lib/did'

export default React.forwardRef(BodyPartProfile)

function BodyPartProfile({ to, onModified, accountToken }, ref) {
  const refLink = React.useRef()

  const [avatar, setAvatar] = React.useState(to.avatar || '')
  const [name, setName] = React.useState(to.name || '')
  const [bio, setBio] = React.useState(to.bio || '')

  React.useImperativeHandle(ref, () => ({
    getData: () => ({ avatar, name, bio })
  }))

  const onSynced = React.useCallback(synced => {
    if (!synced) {
      onModified(to => ({ ...to, key: to.key, did: '', socials: [] }))
    } else {
      if (synced.handle) { // TODO
        refLink.current?.updateHandle(synced.key)
      }
      setAvatar(synced.avatar)
      setName(synced.name)
      setBio(synced.bio)
      onModified(to => ({ ...to, ...synced }))
    }
  }, [onModified])

  const updateAvatar = React.useCallback(async v => {
    setAvatar(v)
    onModified()
  }, [onModified])

  const updateName = React.useCallback(v => {
    setName(v)
    onModified()
  }, [onModified])

  const updateBio = React.useCallback(v => {
    setBio(v)
    onModified()
  }, [onModified])

  let iconType = to.did

  if (iconType === 'dotbit') {
    iconType = 'dotbit-badge'
  }
  
  const labelIcon = to.did && <div className='ml-1 w-4 h-4'><Icon type={iconType} /></div>
  const validDid = DIDs.find(item => item.id === to.did)
  const didProfileUrl = validDid ? `${validDid.link}/${to.handle}` : ''

  return (
    <>
      <div className='flex flex-row items-center justify-between'>
        <div className='text-xl font-semibold'>Profile</div>
        <SyncDidButton to={to} onSynced={onSynced} accountToken={accountToken} />
      </div>

      {
        to.did &&
        <div className='mt-1 text-sm'>
          Edit on{' '}
          <a
            className='underline cursor-pointer hover:text-primary/50'
            href={didProfileUrl}
            target='_blank'
            rel='noreferrer'
          >
            {validDid?.domain}
          </a>
        </div>
      }

      <div className='mt-2 self-center'>
        <AvatarWrapper badge={{ type: to.did, href: didProfileUrl }}>
        {
          to.did
          ? <Avatar url={avatar} addr={to.addr} />
          : <AvatarUploader
              addr={to.addr}
              onUploaded={updateAvatar}
              accountToken={accountToken}
            >
              <Avatar url={avatar} addr={to.addr} />
            </AvatarUploader>
        }
        </AvatarWrapper>
      </div>

      <div className='mt-2'>
        <LinkInput ref={refLink} to={to} labelIcon={labelIcon} accountToken={accountToken} />
      </div>

      <Input
        id='name'
        className='mt-4'
        label={<>Name{labelIcon}</>}
        value={name}
        onChange={updateName}
        disabled={!!to.did}
        placeholder='Enter your name'
        maxLength={24}
      >
        <div className='absolute bottom-[16px] right-4 text-primary/30 font-semibold'>
          {name.length} / 24
        </div>
      </Input>

      <Input
        id='bio'
        className='mt-4'
        inputClassName='pb-[28px]'
        type='textarea'
        label={<>Bio{labelIcon}</>}
        value={bio}
        onChange={updateBio}
        disabled={!!to.did}
        placeholder='Describe who you are'
        maxLength={100}
      >
        <div className='absolute bottom-[16px] right-4 text-primary/30 font-semibold'>
          {bio.length} / 100
        </div>
      </Input>

      {
        to.did && !!to.socials?.length &&
        <div className='mt-4'>
          <label className='flex flex-row text-primary text-sm h-4.5'>
            Social Links{labelIcon}
          </label>
          <SocialButtons socials={to.socials} className='mt-2' />
        </div>
      }
    </>
  )
}
