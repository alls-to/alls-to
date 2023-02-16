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

const getLink3ProfileData = gql`
query getLink3ProfileData($handle: String!) {
  profileByHandle(handle: $handle) {
    metadataInfo {
      avatar
      bio
      handle
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
        links {
          title
          link
        }
        superLinks {
          type
          title
          link
          description
          image
        }
        mentions {
          twitter {
            id
            handle
            name
            avatar
          }
          title
          description
        }
        galaxyCredentials {
          id
          name
        }
        poaps {
          id
          image
        }
        nfts {
          chainId
          contract
          tokenId
          type
          name
          image
          owner
        }
        w3sts {
          tokenUri
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

function _parseLink3Profile(data) {
  if (!data.profileByHandle) {
    return
  }

  const { metadataInfo, externalMetadataInfo } = data.profileByHandle
  const section = externalMetadataInfo?.section || []
  let { avatar, handle, displayName: name } = metadataInfo || {}

  if (!handle) {
    return
  }

  if (avatar && avatar.startsWith('ipfs')) {
    avatar = 'https://ipfs.cyberconnect.dev/' + avatar.replace('ipfs://', 'ipfs/')
  }

  const linksData = section.filter(sec => sec.type === 'LINK' && sec.links !== null).map(item => item.links?.[0])
  const socials = linksData.map(parseLinkType) || null
  // let bio = info.bio
  let bio = null
  if (!bio) {
    const { title, organization} = externalMetadataInfo.personal

    if (title && organization) {
      bio = title + ' at ' + organization.name
    }
  }
  return { handle, name, avatar, bio, socials }
}

export async function getProfileFromAddress (address) {
  const data = await gqlClient.request(getProfilesbyOwner, { address })
  const primary = data.address.wallet.profiles.edges.find(item => item.node?.isPrimary)?.node

  if (!primary) {
    return
  }

  const link3Profile = await gqlClient.request(getLink3ProfileData, { handle: primary.handle })
  return _parseLink3Profile(link3Profile)
}

export async function getProfileFromHandle (handle) {
  const data = await gqlClient.request(getProfileByHandle, { handle })
  if (!data.profileByHandle?.isPrimary) {
    return
  }
  const addr = data.profileByHandle.owner.address.toLowerCase()
  const link3Profile = await gqlClient.request(getLink3ProfileData, { handle })
  return { addr, ..._parseLink3Profile(link3Profile) }
}
