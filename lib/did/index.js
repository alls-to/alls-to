import * as link3 from './link3'
import * as dotbit from './dotbit'

// TODO: did services manager
export const DIDs = [
  {
    id: 'link3',
    fullName: 'Link3 / CyberConnect',
    name: 'Link3',
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

export async function getProfileFromAddress(addr, id = 'link3') {
  try {
    if (id === 'link3') {
      return await link3.getProfileFromAddress(addr)
    } else if (id === 'dotbit') {
      return await dotbit.getProfileFromAddress(addr)
    }
  } catch (e) {
    console.log(e)
     // TODO: refactor error catching
    return false
  }
}

export async function getProfileFromKey(key) {
  try {
    if (key.endsWith('.cyber')) {
      return await link3.getProfileFromKey(key)
    } else if (key.endsWith('.bit')) {
      return await dotbit.getProfileFromKey(key)
    }
  } catch (e) {
    console.log(e)
     // TODO: refactor error catching
    return false
  }
}

export async function getProfileFromHandle(handle, id = 'link3') {
  const suffix = getDid(id)?.suffix
  const key = suffix && (handle.endsWith(suffix) ? handle : `${handle}${suffix}`)
  if (!key) {
    return false
  }
  return getProfileFromKey(key)
}
