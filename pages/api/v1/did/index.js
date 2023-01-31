import { Recipients } from 'lib/db'
import verifyJwt from 'lib/verifyJwt'
import { getProfileFromAddress, getProfileFromKey } from 'lib/did'

export default async function handler (req, res) {
  const encoded = verifyJwt(req.headers.authorization)
  if (!encoded) {
    res.status(401).end()
    return
  }
  const addr = encoded.sub
  
  if (req.method === 'POST') {
    const profile = await getProfileFromAddress(addr)
    if (!profile) {
      res.status(400).end()
      return
    }
    const doc = await Recipients.findByIdAndUpdate(addr, { did: 'cyberconnect', ...profile }, { new: true })
    res.json({ result: { address: doc._id, ...doc.toJSON(), ...profile } })
  } else if (req.method === 'DELETE') {
    const doc = await Recipients.findByIdAndUpdate(addr, { did: '', socials: [] }, { new: true })
    res.json({ result: doc })
  } else {
    res.end()
  }
}
