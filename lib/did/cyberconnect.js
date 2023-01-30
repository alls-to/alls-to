import { GraphQLClient, gql } from 'graphql-request'

const gqlClient = new GraphQLClient(process.env.URL_CYBERCONNECT)

const getProfileByHandle = gql`
query getProfileByHandle($chainID: ChainID, $handle: String!){
  profileByHandle(chainID: $chainID, handle: $handle) {
    avatar
    owner {
      address
    }
    isPrimary
  }
}`

const getProfilesbyOwner = gql`
query getProfilesbyOwner($address: AddressEVM!, $chainID: ChainID!) {
  address(address: $address, chainID: $chainID) {
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
query getLink3ProfileData($chainID: ChainID, $handle: String!) {
  profileByHandle(chainID: $chainID, handle: $handle) {
    externalMetadataInfo {
      type
      handle
      displayName {
        type
        value
      }
      avatar {
        type
        nfts {
          chainId
          contract
          tokenId
          type
          name
          image
          owner
        }
        image
      }
      background {
        type
        nfts {
          chainId
          contract
          tokenId
          type
          name
          image
          owner
        }
        image
      }
      bio
      organization {
        twitterId
        verified
        followersCount
        cmcTokenId
        sector
        networks
      }
      personal {
        headline {
          twitter {
            id
            handle
            name
            avatar
          }
          title
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
  } else if (/t\.me/.test(link.link)) {
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
  const info = data.profileByHandle.externalMetadataInfo

  const {
    handle: uid,
    displayName: { value: name },
    avatar: { image: avatar },
    section
  } = info
  const socials = section.filter(sec => sec.type === 'LINK')?.[0]?.links.map(parseLinkType) || null
  // let bio = info.bio
  let bio
  if (!bio) {
    const headline = info.personal?.headline
    if (headline) {
      bio = headline.title + ' at ' + headline.twitter.name
    }
  }
  return { uid, name, avatar, bio, socials }
}

export async function getProfileFromAddress (address) {
  const variables = { address, chainID: 1 }
  const data = await gqlClient.request(getProfilesbyOwner, variables)
  const primary = data.address.wallet.profiles.edges.find(item => item.node?.isPrimary)?.node

  if (!primary) {
    return
  }

  const link3Profile = await gqlClient.request(getLink3ProfileData, { handle: primary.handle, chainID: 1 })
  return _parseLink3Profile(link3Profile)
}

export async function getProfileFromKey (key) {
  const data = await gqlClient.request(getProfileByHandle, { handle: key, chainID: 1 })
  if (!data.profileByHandle?.isPrimary) {
    return
  }
  const address = data.profileByHandle.owner.address.toLowerCase()
  const link3Profile = await gqlClient.request(getLink3ProfileData, { handle: key, chainID: 1 })
  return { address, ..._parseLink3Profile(link3Profile) }
}
