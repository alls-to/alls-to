import { getAddressFormat } from '@mesonfi/web3-jwt/lib'

import { AllsTo } from 'lib/db'
import { getProfileFromAddress, getProfileFromHandle } from 'lib/did'

const DEFAULT_NETWORKS = {
  ethers: 'polygon',
  tron: 'tron',
  aptos: 'aptos'
}

// export async function getToList (query, click = false) {
//   let docs
//   if (click) {
//     docs = await AllsTo.find(query)
//     // docs = await AllsTo.findAndUpdate(query, { $inc: { clicks: 1 } })
//   } else {
//     docs = await AllsTo.find(query)
//   }

//   return await Promise.all(docs.map(async doc => {
//     return doc.toJSON()
//   }))
// }

export async function createToForAddr(addr, click) {
  const type = getAddressFormat(addr)
  if (!type) {
    return null
  }

  let profile
  if (type === 'ethers') {
    profile = await getProfileFromAddress(addr)
  }

  const doc = {
    addr,
    networkId: DEFAULT_NETWORKS[type],
    tokens: [type === 'tron' ? 'usdt' : 'usdc'],
    clicks: click ? 1 : 0,
    ...profile
  }

  if (profile) {
    doc.key = `${profile.handle}#link3`
    doc.did = 'link3'
  }

  return await AllsTo.create(doc)
}

async function _queryWithHandle (handle) {
  const conditions = [
    { key: handle },
    { key: { $gt: `${handle}#`, $lt: `${handle}#~` } },
  ]
  if (handle.length === 12) {
    // TODO: may have issue
    conditions.push({ addr: { $gt: handle, $lt: `${handle}~` } })
  }
  return await AllsTo.find({ $or: conditions })
}

export async function queryPage(handleOrAddr, click) {
  const type = getAddressFormat(handleOrAddr)
  if (type) {
    const addr = type === 'tron' ? handleOrAddr : handleOrAddr.toLowerCase()
    const toList = await AllsTo.find({ addr })
    if (toList.length) {
      return await Promise.all(toList.map(async doc => {
        if (doc.did) {
          const profile = await getProfileFromAddress(addr, doc.did)
          return await AllsTo.findOneAndUpdate({ key: doc.key }, profile, { new: true })
        }
        return doc
      }))
    }
    const created = await createToForAddr(addr, click)
    return created ? [created] : []
  }

  const toList = await _queryWithHandle(handleOrAddr)
  if (toList.length) {
    return await Promise.all(toList.map(async doc => {
      const handle = doc.key.split('#')[0]
      if (doc.did && handle) {
        const profile = await getProfileFromHandle(handle, doc.did)
        return await AllsTo.findOneAndUpdate({ key: doc.key }, profile, { new: true })
      }
      return doc
    }))
  }

  const profile = await getProfileFromHandle(handleOrAddr)
  if (!profile) {
    return []
  }

  const { handle, ...rest } = profile
  const doc = await AllsTo.findOneAndUpdate({ addr: profile.addr }, {
    key: `${handle}#link3`,
    did: 'link3',
    $setOnInsert: {
      addr: profile.addr,
      networkId: DEFAULT_NETWORKS.ethers,
      tokens: ['usdc'],
      ...rest,
    },
    $inc: { clicks: click ? 1 : 0 }
  }, { upsert: true, new: true })

  return [doc]
}
