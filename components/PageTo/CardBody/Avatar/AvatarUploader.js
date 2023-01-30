import React from 'react'
import classnames from 'classnames'
import { useDropzone } from 'react-dropzone'
import { utils } from 'ethers'

import * as api from 'lib/api'
import refs from 'lib/refs'

import Icon from 'components/icons'

const BUCKET = process.env.NEXT_PUBLIC_AWS_BUCKET
const REGION = process.env.NEXT_PUBLIC_AWS_REGION

export default function AvatarUploader({ address, onUploaded, accountToken, children }) {
  const {
    getRootProps,
    getInputProps,
    // isFocused,
    isDragAccept,
    // isDragReject,
    fileRejections
  } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpeg'],
      'image/jpg': ['.jpg'],
    },
    multiple: false,
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0]
      if (!file) {
        return
      }

      const size = file.size / 1024
      if (size > 5000) {
        refs.toast.current?.show({ title: 'The maximum file size is 5M.', type: 'warning' })
        return
      }
      updateAvatar(file)
    }
  })

  // const style = React.useMemo(() => ({}), [
  //   isFocused,
  //   isDragAccept,
  //   isDragReject
  // ])

  const updateAvatar = async file => {
    const toastId = refs.toast.current?.show({ title: 'Uploading...', sticky: true, type: 'info' })
    const folder = 'avatars'
    const ext = /[^.]+$/.exec(file.name)
    const key = `${folder}/${address}-${utils.id(file.name)}.${ext}`
    const url = await api.getAWSPresignUrlByFileKey(accountToken, key)

    const res = await window.fetch(url, {
      method: 'PUT',
      body: file
    })

    const publicUrl = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`
    if (res.status === 200) {
      await onUploaded(publicUrl)
      refs.toast.current?.close(toastId)
    } else {
      refs.toast.current?.show({ title: 'Upload failed.', type: 'error' })
    }
  }

  React.useEffect(() => {
    if (fileRejections.length > 0) {
      refs.toast.current?.show({ title: 'Only PNG, JPEG files are accepted.', type: 'warning' })
    }
  }, [fileRejections])

  // getRootProps({ style })
  return (
    <div {...getRootProps()} className='group relative w-full h-full'>
      {children}
      <div className={classnames('absolute inset-0 hover:bg-primary/70 flex items-center justify-center cursor-pointer', isDragAccept ? 'bg-primary/70' : '')} >
        <input {...getInputProps()} />
        <div className={classnames('w-4 h-4 group-hover:visible', isDragAccept ? 'visible' : 'invisible')}>
          <Icon type='camera' />
        </div>
      </div>
    </div>
  )
}
