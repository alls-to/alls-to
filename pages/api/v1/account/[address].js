import { AllsTo } from 'lib/db'

export default async function handler(req, res) {
  const { address } = req.query

  if (req.method === 'GET') {
    const exist = await AllsTo.findOne({ addr: address.toLowerCase() })
    res.json({ result: exist })
  } else {
    res.end()
  }
}
