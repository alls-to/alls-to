import * as link3 from './link3'

export async function getProfileFromAddress(addr, service = 'link3') {
  if (service === 'link3') {
    return await link3.getProfileFromAddress(addr)
  }
}

export async function getProfileFromHandle(handle, service = 'link3') {
  if (service === 'link3') {
    return await link3.getProfileFromHandle(handle)
  }
}
