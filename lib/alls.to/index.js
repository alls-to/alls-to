import { getAddressFormat } from '@mesonfi/web3-jwt/lib'

import { AllsTo } from 'lib/db'
import { DIDs, getProfileFromAddress, getProfileFromHandle } from 'lib/did'

const DEFAULT_NETWORKS = {
  ethers: 'polygon',
  tron: 'tron',
  aptos: 'aptos'
}

export async function queryWithAddr(addr, click) {
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
    toList = await AllsTo.find({ addr })
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
    doc.key = `${profile.handle}`
    doc.did = 'link3'
  }

  return [await AllsTo.create(doc)]
}

async function _queryWithHandle(handle, click) {
  const didConditions = DIDs.map(did => `${handle}${did.suffix}`)
  const conditions = [
    { key: handle },
    { key: { $in: [handle].concat(didConditions) } },
  ]
  if (handle.length === 12) {
    // TODO: may have issue
    conditions.push({ addr: { $gt: handle, $lt: `${handle}~` } })
  }
  if (click) {
    // TODO
    const match = await AllsTo.findOneAndUpdate({ $or: conditions }, { $inc: { clicks: 1 } }, { new: true })
    return match ? [match] : []
  } else {
    return await AllsTo.find({ $or: conditions })
  }
}

export async function queryPage(handleOrAddr, click) {
  let toList = await queryWithAddr(handleOrAddr, click)
  if (toList) {
    return toList
  }

  toList = await _queryWithHandle(handleOrAddr, click)
  if (toList.length) {
    return await Promise.all(toList.map(async doc => {
      let handle = doc.key
      let did = doc.did

      // if handle with no suffix,  query the cyber profile first
      if (!(handleOrAddr.endsWith('.bit') || handleOrAddr.endsWith('.cyber'))) {
        handle = handleOrAddr
        did = 'link3'
      }

      if (did && handle) {
        let profile = await getProfileFromHandle(handle, did)

        if (!profile) {
          did = 'dotbit'
          handle = `${handle}.bit`
          profile = await getProfileFromHandle(handle, did)
        }

        if (profile) {
          const { did, name, bio, socials, avatar, ...rest } = profile
          return await AllsTo.findOneAndUpdate({
            addr: profile.addr
          }, {
            key: handle,
            did,
            name,
            bio,
            socials,
            avatar,
            $setOnInsert: {
              addr: profile.addr,
              networkId: DEFAULT_NETWORKS.ethers,
              tokens: ['usdc'],
              ...rest,
            },
          }, { new: true, upsert: true })
        }
      }
      return doc
    }))
  }

  let handle
  let did
  if (handleOrAddr.endsWith('.bit')) {
    handle = handleOrAddr
    did = 'dotbit'
  } else {
    handle = handleOrAddr.endsWith('.cyber') ? handleOrAddr.substring(0, handleOrAddr.lastIndexOf('.')) : handleOrAddr
    did = 'link3'
  }

  if (!handle) return []

  let profile = await getProfileFromHandle(handle, did)

  if (!profile) {
    did = 'dotbit'
    handle = `${handle}.bit`
    profile = await getProfileFromHandle(handle, did)
  }

  if (!profile) {
    return []
  }

  const { handle: suffixHandle, name, bio, avatar, socials, ...rest } = profile
  const doc = await AllsTo.findOneAndUpdate({ addr: profile.addr }, {
    key: suffixHandle,
    did,
    name,
    bio,
    socials,
    avatar,
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
