function newCodedError(error) {
  const err = new Error(error.message)
  err.code = error.code
  return err
}

export async function checkRecipient(uid, token) {
  const res = await window.fetch(`/api/v1/recipient/${uid}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const result = await res.json()
  if (result.error) {
    throw newCodedError(result.error)
  }
  return result.result
}

export async function updateRecipient(data, token) {
  const body = JSON.stringify(data)
  const res = await window.fetch(`/api/v1/recipient`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body
  })
  const result = await res.json()
  if (result.error) {
    throw newCodedError(result.error)
  }
  return result
}