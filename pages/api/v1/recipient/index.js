import { getAddressFormat } from '@mesonfi/web3-jwt/lib'

import { Recipients } from 'lib/db'
import verifyJwt from 'lib/verifyJwt'

const DEFAULT_NETWORKS = {
  ethers: 'polygon',
  tron: 'tron',
  aptos: 'aptos'
}

export default async function handler (req, res) {
  const encoded = verifyJwt(req.headers.authorization)
  if (!encoded) {
    res.status(401).end()
    return
  }
  const addr = encoded.sub
  
  if (req.method === 'POST') {
    let doc = await Recipients.findById(addr)

    if (!doc) {
      const type = getAddressFormat(addr)
      if (!type) {
        res.status(404).end()
        return
      }

      const _id = type === 'tron' ? addr : addr.toLowerCase()
      doc = await Recipients.create({
        _id,
        networkId: DEFAULT_NETWORKS[type],
        tokens: [type === 'tron' ? 'usdt' : 'usdc']
      })
    }

    res.json({ result: { address: doc._id, ...doc.toJSON() } })
  } else if (req.method === 'PUT') {
    const { uid, name, desc, networkId, tokens, avatar } = req.body
    if (uid === 'edit') {
      res.status(400).end()
      return
    }
    try {
      const result = await Recipients.findByIdAndUpdate(addr, { uid, name, desc, avatar, networkId, tokens }, { upsert: true, new: true })
      res.json({ result })
    } catch (e) {
      const code = e.codeName === 'DuplicateKey' ? 409 : 400
      res.status(code).json({
        error: { code, message: e.message }
      })
    }
  } else {
    res.end()
  }
}
