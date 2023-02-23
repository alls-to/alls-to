function newCodedError(error) {
  const err = new Error(error.message)
  err.code = error.code
  return err
}

export async function checkHandle(handle, token) {
  const res = await window.fetch(`/api/v1/handle/${handle}`, {
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

export async function claimHandle(handle, token) {
  const res = await window.fetch(`/api/v1/handle/${handle}`, {
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

export async function postMyself(token) {
  const res = await window.fetch(`/api/v1/me`, {
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

export async function updateMyself(data, token) {
  const body = JSON.stringify(data)
  const res = await window.fetch(`/api/v1/me`, {
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
  return result.result
}

export async function syncDid(key, did, token) {
  let apiPath = `/api/v1/sync`
  if (key) {
    apiPath += `/${encodeURIComponent(key)}`
  }
  const res = await window.fetch(apiPath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ did })
  })

  if (res.status === 404) {
    return
  }

  const result = await res.json()
  if (result.error) {
    throw newCodedError(result.error)
  }
  return result.result
}

export async function unsyncDid(key, token) {
  const res = await window.fetch(`/api/v1/sync/${encodeURIComponent(key)}`, {
    method: 'DELETE',
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
