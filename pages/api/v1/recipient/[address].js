import { utils } from 'ethers'
import presets from '@mesonfi/presets'

import { Recipients } from 'lib/db'

export default async function handler (req, res) {
  if (req.method === 'PUT') {
    const { address } = req.query
    const { message, signature } = req.body

    const digest = utils.hashMessage(message)
    const recovered = utils.recoverAddress(digest, signature)
    if (utils.getAddress(address) !== utils.getAddress(recovered)) {
      res.json({ code: -1, error: 'Invalid signature' })
      return
    }

    const match = /Chain: ([\w\s]+)\nTokens: ([\w,]+)/.exec(message)
    if (!match) {
      res.json({ code: -1, error: 'Invalid message' })
      return
    }

    const chain = presets.getAllNetworks().find(n => n.name === match[1])?.id
    const tokens = match[2].toLowerCase().split(',')

    const result = await Recipients.findByIdAndUpdate(address, { address, chain, tokens }, { new: true })
    res.json({ result })
  } else {
    res.end()
  }
}
