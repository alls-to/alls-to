import { Recipients } from 'lib/db'
import verifyJwt from 'lib/verifyJwt'

export default async function handler (req, res) {
  const encoded = verifyJwt(req.headers.authorization)
  if (!encoded) {
    res.status(401).end()
    return
  }
  const { uid } = req.query

  if (req.method === 'GET') {
    if (uid === 'edit') {
      res.json({ result: true })
      return
    }
    const exist = await Recipients.findOne({ uid })
    res.json({ result: !!exist })
  } else if (req.method === 'POST') {
    if (uid === 'edit') {
      res.status(400).end()
      return
    }
    await Recipients.findOneAndUpdate(encoded.sub, { uid })
    res.json({ result: true })
  } else {
    res.end()
  }
}
