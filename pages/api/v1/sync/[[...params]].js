import { AllsTo } from 'lib/db'
import verifyJwt from 'lib/verifyJwt'
import { getProfileFromAddress } from 'lib/did'

export default async function handler (req, res) {
  const encoded = verifyJwt(req.headers.authorization)
  if (!encoded) {
    res.status(401).end()
    return
  }
  const addr = encoded.sub

  if (req.method === 'POST') {
    const did = req.body?.did

    if (!did) {
      res.status(400).end()
      return
    }

    const profile = await getProfileFromAddress(addr, did)
    if (!profile) {
      res.status(400).end()
      return
    }
    const key = req.query.params?.[0] || { $exists: false }
    const doc = await AllsTo.findOneAndUpdate({ addr, key }, {
      key: `${profile.handle}#${did}`,
      did,
      ...profile
    }, { new: true })
    if (!doc) {
      res.status(404).end()
      return
    }
    res.json({ result: doc })
  } else if (req.method === 'DELETE') {
    const key = req.query.params[0]
    const doc = await AllsTo.findOneAndUpdate({ addr, key }, {
      key: key.split('#')[0], // TODO: should we keep existing key?
      did: '',
      socials: []
    }, { new: true })
    if (!doc) {
      res.status(404).end()
      return
    }
    res.json({ result: doc })
  } else {
    res.end()
  }
}
