import { Recipients } from 'lib/db'
import verifyJwt from 'lib/verifyJwt'

export default async function handler (req, res) {
  if (req.method === 'PUT') {
    const encoded = verifyJwt(req.headers.authorization)
    if (!encoded) {
      res.status(401).end()
      return
    }

    const { uid, name, desc, networkId, tokens } = req.body
    try {
      const result = await Recipients.findByIdAndUpdate(decoded.sub, { uid, name, desc, networkId, tokens }, { upsert: true, new: true })
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
