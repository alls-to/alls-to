import { getAddressFormat } from '@mesonfi/web3-jwt/lib'

import { AllsTo } from 'lib/db'
import { DIDs, getProfileFromAddress, getProfileFromKey, getProfileFromHandleOrKey } from 'lib/did'

const DEFAULT_NETWORKS = {
  ethers: 'polygon',
  tron: 'tron',
  aptos: 'aptos'
}

// TODO: @yangyi describe what this function does using plain English
export async function queryWithAddr (addr, click) {
  const type = getAddressFormat(addr)
  if (!type) {
    return
  }

  addr = type === 'tron' ? addr : addr.toLowerCase()

  let toList
  if (click) {
    // TODO
    const match = await AllsTo.findOneAndUpdate({ addr }, { $inc: { clicks: 1 } }, { new: true })
    toList = match ? [match] : []
  } else {
    toList = await AllsTo.find({ addr }).sort({ did: -1 })
  }
  if (toList.length) {
    return await Promise.all(toList.map(async doc => {
      if (doc.did) {
        const profile = await getProfileFromAddress(addr, doc.did)
        if (profile) {
          return await AllsTo.findByIdAndUpdate(doc._id, profile, { new: true })
        }
      }
      return doc
    }))
  }

  let profile
  if (type === 'ethers') {
    profile = await getProfileFromAddress(addr, 'link3')
  }

  const doc = {
    addr,
    networkId: DEFAULT_NETWORKS[type],
    tokens: [type === 'tron' ? 'usdt' : 'usdc'],
    clicks: click ? 1 : 0,
    ...profile
  }

  return [await AllsTo.create(doc)]
}

// TODO: @yangyi describe what this function does using plain English
async function _queryWithHandleOrKey (handleOrKey, click) {
  const conditions = []
  if (DIDs.some(did => handleOrKey.endsWith(did.suffix))) {
    conditions.push({ key: handleOrKey })
  } else {
    conditions.push({ key: { $in: [handleOrKey, ...DIDs.map(did => `${handleOrKey}${did.suffix}`)] } })
    if (handleOrKey.length === 12) {
      // TODO: may have issue
      conditions.push({ addr: { $gt: handleOrKey, $lt: `${handleOrKey}~` } })
    }
  }
  
  if (click) {
    // TODO
    const match = await AllsTo.findOneAndUpdate({ $or: conditions }, { $inc: { clicks: 1 } }, { new: true })
    return match ? [match] : []
  } else {
    return await AllsTo.find({ $or: conditions }).sort({ did: -1 })
  }
}

// TODO: @yangyi describe what this function does using plain English
export async function queryPage (handleOrKeyOrAddr, click) {
  // TODO: @yangyi describe what this part is doing using plain English
  let toList = await queryWithAddr(handleOrKeyOrAddr, click)
  if (toList) { // True when receiving a valid address; could be an empty array
    return toList
  }

  const handleOrKey = handleOrKeyOrAddr

  // TODO: @yangyi describe what this part is doing using plain English
  toList = await _queryWithHandleOrKey(handleOrKey, click)
  if (toList.length) {
    return await Promise.all(toList.map(async doc => {
      if (doc.key && doc.did) {
        const profile = await getProfileFromKey(doc.key)
        if (profile) {
          return await AllsTo.findOneAndUpdate({ key: doc.key }, profile, { new: true })
        }
      }
      return doc
    }))
  }

  // TODO: @yangyi describe what this part is doing using plain English
  const profile = await getProfileFromHandleOrKey(handleOrKey, 'link3')
  if (!profile) {
    return []
  }

  const { key, did, addr, ...restProfile } = profile
  const doc = await AllsTo.findOneAndUpdate({ addr, did: '' }, {
    key,
    did,
    ...restProfile,
    $setOnInsert: {
      addr,
      networkId: DEFAULT_NETWORKS.ethers,
      tokens: ['usdc'],
    },
    $inc: { clicks: click ? 1 : 0 }
  }, { upsert: true, new: true })

  return [doc]
}
