function newCodedError(error) {
  const err = new Error(error.message)
  err.code = error.code
  return err
}

export async function checkUid(uid, token) {
  const res = await window.fetch(`/api/v1/uid/${uid}`, {
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

export async function claimUid(uid, token) {
  const res = await window.fetch(`/api/v1/uid/${uid}`, {
    method: 'POST',
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

export async function getRecipient(token) {
  const res = await window.fetch(`/api/v1/recipient`, {
    method: 'POST',
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

export async function getAWSPresignUrlByFileKey(token, fileKey) {
  const res = await window.fetch(`/api/v1/aws/pre-sign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      key: fileKey
    })
  })
  const result = await res.json()
  if (result.error) {
    throw newCodedError(result.error)
  }
  return result.result
}