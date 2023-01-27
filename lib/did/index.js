import * as cyberconnect from './cyberconnect'

export async function getProfileFromAddress(address, service = 'cyberconnect') {
  if (service === 'cyberconnect') {
    return await cyberconnect.getProfileFromAddress(address)
  }
}

export async function getProfileFromKey(key, service = 'cyberconnect') {
  if (service === 'cyberconnect') {
    return await cyberconnect.getProfileFromKey(key)
  }
}
