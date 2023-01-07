import { Recipients } from 'lib/db'
import verifyJwt from 'lib/verifyJwt'

export default async function handler (req, res) {
  if (req.method === 'GET') {
    const encoded = verifyJwt(req.headers.authorization)
    if (!encoded) {
      res.status(401).end()
      return
    }

    const { uid } = req.query
    if (uid === 'edit') {
      res.json({ result: true })
    }
    const exist = await Recipients.findOne({ uid })
    res.json({ result: !!exist })
  } else {
    res.end()
  }
}
