import * as link3 from './link3'
import * as dotbit from './dotbit'

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
