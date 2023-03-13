import { queryPage } from 'lib/alls.to'

const isProd = process.env.NODE_ENV === 'production'
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { handleOrAddr } = req.query
    const toList = await queryPage(handleOrAddr, isProd)
    res.json({ result: toList[0] ?? false })
  } else {
    res.end()
  }
}
