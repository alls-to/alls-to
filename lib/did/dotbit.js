import { createInstance } from 'dotbit'

const dotbit = createInstance()
const socialKeys = ['discord', 'github', 'twitter']

export async function getProfileFromHandle(handle) {
  if (!handle) {
    return
  }

  try {
    const accountInfo = await dotbit.accountInfo(handle)
    const records = await dotbit.records(handle)

    const avatar = records.find(item => item.key === 'profile.avatar')?.value || null
    const bio = records.find(item => item.key === 'profile.description')?.value || null

    // the key of item will be like: profile.twitter
    const socialsInfo = records.filter(item => socialKeys.includes(item.key?.split('.')?.[1]))
    let socials = socialsInfo.map(item => ({
      type: item.subtype,
      link: item.value
    }))

    if (socials.length === 0) {
      socials = null
    }

    return {
      addr: accountInfo.owner_key,
      handle: accountInfo.account,
      name: accountInfo.account,
      avatar,
      bio,
      socials
    }
  } catch (error) {
    // 20007: account not exist
    if (error.code === 20007) {
      return
    }
    throw error
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

  const { addr: address, ...restData } = await getProfileFromHandle(handle)
  return restData
}
