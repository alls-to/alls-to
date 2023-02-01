import { AllsTo } from 'lib/db'
import verifyJwt from 'lib/verifyJwt'

const reservedWords = process.env.RESERVED_WORDS.split(',')

export default async function handler (req, res) {
  const encoded = verifyJwt(req.headers.authorization)
  if (!encoded) {
    res.status(401).end()
    return
  }
  const { handle } = req.query

  if (req.method === 'GET') {
    if (reservedWords.includes(handle)) {
      res.json({ result: true })
      return
    }
    // TODO
    const exist = await AllsTo.findOne({ key: handle })
    res.json({ result: !!exist })
  } else if (req.method === 'POST') {
    if (reservedWords.includes(handle)) {
      res.status(400).end()
      return
    }
    // TODO
    await AllsTo.findByIdAndUpdate(handle, { key: handle })
    res.json({ result: true })
  } else {
    res.end()
  }
}
