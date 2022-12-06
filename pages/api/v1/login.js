import { verify as verifyJwt } from '@mesonfi/extensions/jwt'

const { NEXT_PUBLIC_SIGNING_MESSAGE } = process.env

export default async function handler (req, res) {
  if (req.method === 'GET') {
    const authorization = req.headers.authorization
    if (authorization) {
      const [key, token] = authorization.split(' ')
      if (key !== 'Bearer') {
        res.status(401).end()
        return
      }

      let payload
      try {
        payload = verifyJwt(token, NEXT_PUBLIC_SIGNING_MESSAGE)
      } catch (e) {
        res.status(401).end()
        return
      }
      res.json({ result: payload })
      return
    }

    res.json({ result: true })
  } else {
    res.end()
  }
}
