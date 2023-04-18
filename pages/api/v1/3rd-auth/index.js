import { queryWithAddr } from 'lib/alls.to'
import { ethers } from 'ethers'

export default async function handler(req, res) {
  const { uuid, utoken } = req.body?.account || {}
  const message = req.body?.message

  const response = await fetch('https://api.particle.network/server/rpc', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID + ':' + process.env.PARTICLE_SERVER_KEY)}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 0,
      method: 'getUserInfo',
      params: [uuid, utoken],
    })
  })

  const data = await response.json()

  if (data.error) {
    res.status(401).end()
    return
  }

  const addr = data?.result?.wallets?.[0]?.publicAddress

  if (!addr) {
    res.status(400).end()
    return
  }

  if (req.method === 'POST') {
    const account = await queryWithAddr(addr)
    if (!account) {
      res.status(400).end()
      return
    }
    const provider = new ethers.providers.JsonRpcProvider('https://polygon.llamarpc.com')
    const wallet = new ethers.Wallet(process.env.PARTICLE_VERIFIER_PRIVATE_KEY, provider)

    const signature = await wallet.signMessage(message)

    res.json({
      result: {
        account,
        signature
      }
    })
  } else {
    res.end()
  }
}
