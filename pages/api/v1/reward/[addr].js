import { queryAndSendReward } from 'lib/alls.to/reward'

const parseCookie = (cookieString) => {
  if (!cookieString) {
    return
  }

  const cookies = cookieString.split('; ')
  const cookieObj = {}

  for (let i = 0; i < cookies.length; i++) {
    const [name, value] = cookies[i].split('=')
    cookieObj[name] = decodeURIComponent(value)
  }

  return cookieObj
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { addr } = req.query
    const cookies = parseCookie(req.headers.cookie) || {}
    const { code } = cookies

    if (!code) {
      res.json({ result: false })
      return
    }

    const rewardRecord = await queryAndSendReward(code, addr)
    res.json({ result: rewardRecord })
  } else {
    res.end()
  }
}
