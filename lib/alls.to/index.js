import { getAddressFormat } from '@mesonfi/web3-jwt/lib'

import { Recipients } from 'lib/db'
import { getProfileFromAddress, getProfileFromKey } from 'lib/did'

const DEFAULT_NETWORKS = {
  ethers: 'polygon',
  tron: 'tron',
  aptos: 'aptos'
}

export async function getRecipientWithProfile (query, click = false) {
  let doc
  if (typeof query === 'string') {
    if (click) {
      doc = await Recipients.findByIdAndUpdateAnd(query, { $inc: { clicks: 1 } })
    } else {
      doc = await Recipients.findById(query)
    }
  } else {
    if (click) {
      doc = await Recipients.findOneAndUpdate(query, { $inc: { clicks: 1 } })
    } else {
      doc = await Recipients.findOne(query)
    }
  }

  if (!doc) {
    return null
  }

  let profile
  if (doc.did) {
    profile = await getProfileFromAddress(doc._id, doc.did)
    // update profile
  }

  return { address: doc._id, ...doc.toJSON(), ...profile }
}

export async function postRecipient (query, addr = '', click = false) {
  const result = await getRecipientWithProfile(query, click)
  if (result) {
    return result
  }

  if (!addr && typeof query === 'string') {
    addr = query
  }

  const type = getAddressFormat(addr)
  if (!type) {
    return null
  }

  let profile
  if (type === 'ethers') {
    profile = await getProfileFromAddress(addr)
  }

  const _id = type === 'tron' ? addr : addr.toLowerCase()
  const doc = await Recipients.create({
    _id,
    networkId: DEFAULT_NETWORKS[type],
    tokens: [type === 'tron' ? 'usdt' : 'usdc'],
    did: profile ? 'cyberconnect' : undefined,
    clicks: click ? 1 : 0,
    ...profile
  })

  return { address: doc._id, ...doc.toJSON(), ...profile }
}

export async function queryPage (key, click) {
  const type = getAddressFormat(key)
  if (type && type !== 'tron') {
    key = key.toLowerCase()
  }

  const conditions = [{ _id: key }, { uid: key }]
  if (key.length === 12) {
    conditions.push({ _id: { $gt: key, $lt: `${key}~` } })
  }

  const result = await postRecipient({ $or: conditions }, key, click)
  if (result) {
    return result
  }

  const profile = await getProfileFromKey(key)
  if (!profile) {
    return null
  }

  const doc = await Recipients.create({
    _id: profile.address,
    networkId: DEFAULT_NETWORKS.ethers,
    tokens: ['usdc'],
    did: 'cyberconnect',
    clicks: click ? 1 : 0,
    ...profile
  })

  return { ...doc.toJSON(), ...profile }
}
