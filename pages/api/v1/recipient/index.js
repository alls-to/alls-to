import { getRecipientWithProfile, postRecipient } from 'lib/alls.to'
import { Recipients } from 'lib/db'
import verifyJwt from 'lib/verifyJwt'

const reservedWords = process.env.RESERVED_WORDS.split(',')

export default async function handler (req, res) {
  const encoded = verifyJwt(req.headers.authorization)
  if (!encoded) {
    res.status(401).end()
    return
  }
  const addr = encoded.sub
  
  if (req.method === 'GET') {
    const result = await getRecipientWithProfile(addr)
    res.json({ result })
  } else if (req.method === 'POST') {
    const result = await postRecipient(addr)
    if (!result) {
      res.status(404).end()
      return
    }
    res.json({ result })
  } else if (req.method === 'PUT') {
    const { uid, name, desc, networkId, tokens, avatar } = req.body
    if (reservedWords.includes(uid)) {
      res.status(400).end()
      return
    }
    try {
      const doc = await Recipients.findByIdAndUpdate(
        addr,
        { uid, name, desc, networkId, tokens, avatar },
        { upsert: true, new: true }
      )
      res.json({ result: { address: doc._id, ...doc.toJSON() } })
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
