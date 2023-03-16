import { createInstance } from 'dotbit'

const dotbit = createInstance()

// TODO: move to did manager
const socialKeys = ['github', 'twitter', 'telegram', 'medium', 'linkedin']

// TODO: move to did manager
const parseLinkType = (key, value) => {
  if (key === 'github') {
    return /github\.com/.test(value) ? value : `https://github.com/${value}`
  } else if (key === 'twitter') {
    return /twitter\.com/.test(value) ? value : `https://twitter.com/${value}`
  } else if (key === 'medium') {
    return /medium\.com/.test(value) ? value : `https://medium.com/${value}`
  } else if (key === 'telegram') {
    return /t\.me\//.test(value) ? value : `https://t.me/${value}`
  } else if (key === 'linkedin') {
    return /linkedin\.com/.test(value) ? value : `https://linkedin.com/in/${value}`
  }

  return value
}

export async function getProfileFromKey(handle) {
  if (!handle) {
    return
  }

  let accountInfo
  let records

  try {
    accountInfo = await dotbit.accountInfo(handle)
    records = await dotbit.records(handle)
  } catch (error) {
    // 20007: account not exist
    if (error.code === 20007) {
      return
    }
    throw error
  }

  const avatar = records.find(item => item.key === 'profile.avatar')?.value || null
  const bio = records.find(item => item.key === 'profile.description')?.value || null

  // the key of item will be like: profile.twitter
  const socialsInfo = records.filter(item => socialKeys.includes(item.key?.split('.')?.[1]))
  let socials = socialsInfo.map(item => ({
    type: item.subtype,
    link: parseLinkType(item.subtype, item.value)
  }))

  if (socials.length === 0) {
    socials = null
  }

  return {
    addr: accountInfo.owner_key,
    key: accountInfo.account,
    name: accountInfo.account,
    avatar,
    bio,
    socials
  }
}

export async function getProfileFromAddress(addr) {
  if (!addr) {
    return
  }
  // aliasAccount will be undefined, if not binding with an address
  const aliasAccount = await dotbit.reverse({
    key: addr,
    coin_type: '60' // The coin type of ETH
  })

  let handle = aliasAccount?.account

  if (!handle) {
    // accounts will be an empty array [], if not binding with an address
    const accounts = await dotbit.accountsOfOwner({
      key: addr,
      coin_type: '60'
    })
    handle = accounts[0]?.account
  }

  if (!handle) {
    return
  }

  const profile = await getProfileFromKey(handle)

  if (!profile) {
    return
  }

  const { addr: address, ...restData } = profile
  return restData
}
