import { queryPage } from 'lib/alls.to'

const isProd = process.env.NODE_ENV === 'production'
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { handleOrKeyOrAddr } = req.query
    const toList = await queryPage(handleOrKeyOrAddr, isProd)
    res.json({ result: toList[0] ?? false })
  } else {
    res.end()
  }
}
