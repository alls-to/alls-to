import * as link3 from './link3'
import * as dotbit from './dotbit'

// TODO: did services manager
export const DIDs = [
  {
    id: 'link3',
    name: 'Link3 / CyberConnect',
    alias: 'Link3',
    domain: 'link3.to',
    explorer: 'https://link3.to'
  },
  {
    id: 'dotbit',
    name: '.bit',
    alias: '.bit',
    domain: 'did.id',
    explorer: 'https://data.did.id'
  }
]

export function getAliasById(id) {
  return DIDs.find(item => item.id === id)?.alias
}

export async function getProfileFromAddress(addr, service = 'link3') {
  try {
    if (service === 'link3') {
      return await link3.getProfileFromAddress(addr)
    } else if (service === 'dotbit') {
      return await dotbit.getProfileFromAddress(addr)
    }
  } catch (e) {
    console.warn(e)
  }
}

export async function getProfileFromHandle(handle, service = 'link3') {
  try {
    if (service === 'link3') {
      return await link3.getProfileFromHandle(handle)
    } else if (service === 'dotbit') {
      return await dotbit.getProfileFromHandle(handle)
    }
  } catch (e) {
    console.warn(e)
  }
}
