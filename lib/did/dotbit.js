import { createInstance } from 'dotbit'

const dotbit = createInstance()
const socialKeys = ['discord', 'github', 'twitter']

export async function getProfileFromHandle(handle) {
  if (!handle) {
    return
  }

  const accountInfo = await dotbit.accountInfo(handle)
  const records = await dotbit.records(handle)

  const avatar = records.find(item => item.key === 'profile.avatar')?.value || null
  const bio = records.find(item => item.key === 'profile.description')?.value || null

  // the key of item will be like: profile.twitter
  const socialsInfo = records.filter(item => socialKeys.includes(item.key?.split('.')?.[1]))
  const socials = socialsInfo.map(item => ({
    type: item.subtype,
    link: item.value
  }))

  return {
    addr: accountInfo.owner_key,
    handle: accountInfo.account,
    name: accountInfo.account_alias,
    avatar,
    bio,
    socials
  }
}

export async function getProfileFromAddress(addr) {
  let handle
  const aliasAccount = await dotbit.reverse({
    key: addr,
    coin_type: '60' // The coin type of ETH
  })

  if (!aliasAccount) {
    // accounts will be an empty array [], if not bind with an address
    const accounts = await dotbit.accountsOfOwner({
      key: addr,
      coin_type: '60'
    })
    handle = accounts[0]?.account
  } else {
    handle = aliasAccount?.account
  }

  if (!handle) {
    return
  }

  const { addr: address, ...restData } = await getProfileFromHandle(handle)
  return restData
}
