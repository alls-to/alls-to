import { getAddressFormat } from '@mesonfi/web3-jwt/lib'

import { AllsTo } from 'lib/db'

export default async function handler (req, res) {
  const { address, networkId, token } = req.body
  
  if (req.method === 'POST') {
    const type = getAddressFormat(address)
    if (!type || !['usdc', 'usdt', 'busd'].includes(token)) {
      res.status(404).end()
      return
    }

    // TODO
    // const doc = await AllsTo.findByIdAndUpdate(address, {
    //   _id: address,
    //   networkId,
    //   tokens: [token]
    // }, { upsert: true, new: true }).select('uid networkId tokens')

    // res.json({ result: { link: doc.uid || address.substring(0, 12), address, ...doc.toJSON() } })
  } else {
    res.end()
  }
}
