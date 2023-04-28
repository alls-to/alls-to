import * as cyber from './cyber'
import * as dotbit from './dotbit'

// TODO: did services manager
export const DIDs = [
  {
    id: 'cyber',
    fullName: 'CyberProfile',
    name: 'CyberProfile',
    domain: 'link3.to',
    link: 'https://link3.to',
    suffix: '.cyber'
  },
  {
    id: 'dotbit',
    fullName: '.bit',
    name: '.bit',
    domain: 'did.id',
    link: 'https://data.did.id',
    suffix: '.bit'
  }
]

export function getDid(id) {
  return DIDs.find(item => item.id === id)
}

// TODO: @yangyi describe what this function does using plain English
export async function getProfileFromAddress (addr, id = 'cyber') {
  try {
    if (id === 'cyber') {
      return await cyber.getProfileFromAddress(addr)
    } else if (id === 'dotbit') {
      return await dotbit.getProfileFromAddress(addr)
    }
  } catch (e) {
    console.log(e)
     // TODO: refactor error catching
    return false
  }
}

// TODO: @yangyi describe what this function does using plain English
export async function getProfileFromKey (key) {
  try {
    if (key.endsWith('.cyber')) {
      return await cyber.getProfileFromKey(key)
    } else if (key.endsWith('.bit')) {
      return await dotbit.getProfileFromKey(key)
    }
  } catch (e) {
    console.log(e)
     // TODO: refactor error catching
    return false
  }
}

// TODO: @yangyi describe what this function does using plain English
export async function getProfileFromHandleOrKey (handleOrKey, defaultId = 'cyber') {
  let key
  if (DIDs.find(did => handleOrKey.endsWith(did.suffix))) {
    key = handleOrKey
  } else {
    const suffix = getDid(defaultId)?.suffix
    key = suffix && (handleOrKey.endsWith(suffix) ? handleOrKey : `${handleOrKey}${suffix}`)
  }
  if (!key) {
    return false
  }
  return getProfileFromKey(key)
}
