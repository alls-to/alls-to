import { verify } from '@mesonfi/web3-jwt'

import { Recipients } from 'lib/db'

const { NEXT_PUBLIC_SIGNING_MESSAGE } = process.env

export default async function handler (req, res) {
  if (req.method === 'PUT') {
    let decoded
    const authorization = req.headers.authorization
    if (authorization) {
      const [key, token] = authorization.split(' ')
      if (key !== 'Bearer') {
        res.status(401).end()
        return
      }

      try {
        decoded = verify(token, NEXT_PUBLIC_SIGNING_MESSAGE)
      } catch (e) {
        res.status(401).end()
        return
      }
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
