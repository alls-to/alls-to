import { AllsTo } from 'lib/db'
import verifyJwt from 'lib/verifyJwt'

const reservedWords = process.env.RESERVED_WORDS.split(',')

export default async function handler (req, res) {
  const { key } = req.query

  if (req.method === 'GET') {
    if (reservedWords.includes(key)) {
      res.json({ result: true })
      return
    }
    // TODO
    const exist = await AllsTo.findOne({ key })
    res.json({ result: !!exist })
  } else if (req.method === 'POST') {
    const encoded = verifyJwt(req.headers.authorization)
    if (!encoded) {
      res.status(401).end()
      return
    }

    if (reservedWords.includes(key)) {
      res.status(400).end()
      return
    }
    // TODO
    await AllsTo.findByIdAndUpdate(key, { key })
    res.json({ result: true })
  } else {
    res.end()
  }
}
