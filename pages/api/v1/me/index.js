import { createToForAddr } from 'lib/alls.to'
import { AllsTo } from 'lib/db'
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
    const result = await AllsTo.find({ addr })
    res.json({ result })
  } else if (req.method === 'POST') {
    const result = await createToForAddr(addr)
    if (!result) {
      res.status(404).end()
      return
    }
    res.json({ result })
  } else if (req.method === 'PUT') {
    const { name, avatar, bio, networkId, tokens } = req.body
    // if (reservedWords.includes(uid)) {
    //   res.status(400).end()
    //   return
    // }
    try {
      const doc = await AllsTo.findOneAndUpdate(
        { addr },
        { name, avatar, bio, networkId, tokens },
        { upsert: true, new: true }
      )
      res.json({ result: doc })
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
