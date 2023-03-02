import * as link3 from './link3'

export async function getEventInfoById(id, service = 'link3') {
  if (service === 'link3') {
    return await link3.getEventInfoById(id)
  }
  return
}
