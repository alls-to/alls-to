import { GraphQLClient, gql } from 'graphql-request'

const gqlClient = new GraphQLClient(process.env.URL_CYBERCONNECT)

const getProfileByHandle = gql`
query getProfileByHandle($handle: String!){
  profileByHandle(handle: $handle) {
    metadataInfo {
      avatar
      bio
    }
    owner {
      address
    }
    isPrimary
  }
}`

const getProfilesbyOwner = gql`
query getProfilesbyOwner($address: AddressEVM!) {
  address(address: $address) {
    wallet {
      profiles(first:5) {
        edges {
          node {
            profileID
            isPrimary
            handle
            avatar
            owner {
              address
            }
            namespace{
              name
              contractAddress
              chainID
            }
          }
        }
      }
    }
  }
}`

const getCyberProfileData = gql`
query getLink3ProfileData($handle: String!) {
  profileByHandle(handle: $handle) {
    metadataInfo {
      avatar
      bio
      displayName
    }
    externalMetadataInfo {
      type
      verifiedTwitterID
      organization {
        cmcTokenId
        sector
        networks
      }
      personal {
        verifiedDiscordID
        title
        organization {
          id
          handle
          name
          avatar
        }
      }
      section {
        type
        name
        ... on LinkSection {
          type
          name
          links {
            title
            link
          }
        }
      }
    }
  }
}`

const parseLinkType = link => {
  if (!link?.link) {
    return link
  }
  if (/twitter\.com/.test(link.link)) {
    return { ...link, type: 'twitter' }
  } else if (/t\.me\//.test(link.link)) {
    return { ...link, type: 'telegram' }
  } else if (/github\.com/.test(link.link)) {
    return { ...link, type: 'github' }
  } else if (/medium\.com/.test(link.link)) {
    return { ...link, type: 'medium' }
  } else if (/linkedin\.com/.test(link.link)) {
    return { ...link, type: 'linkedin' }
  } // TODO: more
  return link
}

function _parseCyberProfileWithKey (data, key) {
  if (!data.profileByHandle) {
    return
  }

  const { metadataInfo, externalMetadataInfo } = data.profileByHandle
  const section = externalMetadataInfo?.section || []
  let { avatar, displayName: name } = metadataInfo || {}

  if (avatar && avatar.startsWith('ipfs')) {
    avatar = 'https://ipfs.cyberconnect.dev/' + avatar.replace('ipfs://', 'ipfs/')
  }

  const linksData = section.filter(sec => sec.type === 'LINK' && sec.links !== null).map(item => item.links)
  const links = (linksData.length > 1 ? linksData.flat() : linksData[0]) || []

  const socials = links.map(parseLinkType) || null
  // let bio = info.bio
  let bio = ''
  if (!bio && externalMetadataInfo) {
    const { title, organization } = externalMetadataInfo.personal

    if (title && organization) {
      bio = title + ' at ' + organization.name
    }
  }
  return { did: 'cyber', key, name, avatar, bio, socials }
}

export async function getProfileFromAddress (address) {
  // if address is not exist, will return { address: { wallet: { profiles: { edges: [] } } } }
  const data = await gqlClient.request(getProfilesbyOwner, { address })
  const primary = data.address.wallet.profiles.edges.find(item => item.node?.isPrimary)?.node

  if (!primary) {
    return
  }

  const cyberProfile = await gqlClient.request(getCyberProfileData, { handle: primary.handle })
  return _parseCyberProfileWithKey(cyberProfile, primary.handle)
}

export async function getProfileFromKey (key) {
  const data = await gqlClient.request(getProfileByHandle, { handle: key })

  if (!data.profileByHandle) {
    return
  }

  if (!data.profileByHandle?.isPrimary) {
    return
  }
  const addr = data.profileByHandle.owner.address.toLowerCase()

  const cyberProfile = await gqlClient.request(getCyberProfileData, { handle: key })
  // if not found, will return { profileByHandle: null }
  if (!cyberProfile.profileByHandle) {
    return
  }

  return { addr, ..._parseCyberProfileWithKey(cyberProfile, key) }
}
