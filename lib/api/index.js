function newCodedError(error) {
  const err = new Error(error.message)
  err.code = error.code
  return err
}

export async function checkKey(key, token) {
  const res = await window.fetch(`/api/v1/key/${key}`, {
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

export async function claimKey(key, token) {
  const res = await window.fetch(`/api/v1/key/${key}`, {
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

export async function getProfileByAddr (addr) {
  const res = await window.fetch(`/api/v1/account/${addr}`, {
    method: 'GET',
  })
  const result = await res.json()
  if (result.error) {
    throw newCodedError(result.error)
  }
  return result.result
}


export async function thirdAuthVerify (data) {
  const res = await window.fetch(`/api/v1/3rd-auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  const result = await res.json()
  return result.result
}

export async function queryAndSendReward (addr) {
  const res = await window.fetch(`/api/v1/reward/${addr}`, {
    method: 'GET',
  })
  const result = await res.json()

  if (result.error) {
    throw newCodedError(result.error)
  }
  return result.result
}