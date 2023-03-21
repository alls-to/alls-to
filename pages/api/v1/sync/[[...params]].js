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
    if (profile === false) {
      res.status(400).end()
      return
    }
    
    // if not found will return undefined
    if (!profile) {
      res.status(404).end()
      return
    }

    const key = req.query.params?.[0] || { $exists: false }
    let doc = await AllsTo.findOne({ addr, key: profile.key })
  
    if (doc) {
      // If bonded with did, return the profile directly.
      if (doc.did) {
        res.json({ result: doc })
        return
      }

      // If not bonded with did, update profile and bind did.
      doc = await AllsTo.findOneAndUpdate({ addr, key: profile.key }, {
        ...profile,
        did,
      }, { new: true })

      res.json({ result: doc })
      return
    }

    doc = await AllsTo.findOneAndUpdate({ addr, key }, profile, { new: true })

    // update record if user has only one profile.
    if (!doc) {
      res.status(404).end()
      return
    }
    res.json({ result: doc })
  } else if (req.method === 'DELETE') {
    const key = req.query.params[0]
    const doc = await AllsTo.findOneAndUpdate({ addr, key }, {
      // key: '', // TODO: should we keep existing key?
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
