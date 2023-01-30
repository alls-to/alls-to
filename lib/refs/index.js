import React from 'react'

const refs = {
  toast: React.createRef()
}

export default refs

export const showSuccessToast = data => refs.toast.current?.show({ title: data.message, type: 'success' })
export const showInfoToast = data => refs.toast.current?.show({ title: data.message, type: 'warning' })
export const showErrorToast = e => refs.toast.current?.show({ title: e.message, type: 'error' })
