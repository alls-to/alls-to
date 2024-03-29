import verifyJwt from 'lib/verifyJwt'

export default async function handler (req, res) {
  if (req.method === 'GET') {
    const encoded = verifyJwt(req.headers.authorization)
    if (!encoded) {
      res.status(401).end()
      return
    }

    res.json({ result: encoded })
  } else {
    res.end()
  }
}
