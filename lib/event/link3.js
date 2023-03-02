export async function getEventInfoById(id) {
  let eventData
  try {
    const eventRes = await fetch('https://api.cyberconnect.dev/profile/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'query': `
        query getEventViewData($id: ID!) {
          event(id: $id) {
            __typename
            id
            title
            info
            recap
            posterUrl
            startTimestamp
            endTimestamp
            timezone
            registerStatus
            status
            speakers {
              ...Speaker
            }
            organizer {
              twitterId
              id
              followersCount
              verification
              currentAccess
              lightInfo {
                profileHandle
                profileId
                isFollowing
                displayName
                profilePicture
              }
            }
            w3st {
              ...W3stOnEventViewPage
            }
            registrantsCount
            registrants(first: 7) {
              pageInfo {
                ...PageInfo
              }
              list {
                lightInfo {
                  profileId
                  avatar
                  avatarFrameTokenId
                  displayName
                  formattedAddress
                }
              }
            }
            raffle {
              ...Raffle
            }
            location {
              __typename
              ...TwitterSpaceEvent
              ...DiscordEvent
              ... on DiscordEvent {
                inviteLink
              }
              ...OtherEvent
            }
            tags
            language
            recapLikeInfo {
              likedCount
              isLiked
            }
            registrantsTokenHoldings {
              collection
              logo
              ownedCount
              ownersCount
            }
          }
        }
        
        fragment Speaker on EventSpeaker {
          twitterId
          twitterHandle
          displayName
          avatar
          title
          profileId
          twitterFollowers
          avatarFrameTokenId
        }
        
        fragment W3stOnEventViewPage on W3ST {
          gasless
          imageUrl
          contractInfo {
            deployStatus
            chainId
            essenceAddress
            tokenHoldersCount
          }
          requirements {
            type
            value
          }
        }
        
        fragment PageInfo on PageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        
        fragment Raffle on Raffle {
          awards {
            ...TokenAward
            ...CodeAward
          }
          tweetUrl
          joinStatus {
            status
            myAward
          }
          winnersCount
          joinedCount
          claimDeadline
          participateDeadline
          requirement {
            retweet
            follow
            comment
            likeAndRetweet
            tag
            multiFollow
            twittersToFollow {
              twitterId
              twitterHandle
            }
          }
        }
        
        fragment TokenAward on TokenAward {
          chainId
          tokenIcon
          symbol
          contractAddress
          amount
        }
        
        fragment CodeAward on CodeAward {
          code
          description
        }
        
        fragment TwitterSpaceEvent on TwitterSpaceEvent {
          link
        }
        
        fragment DiscordEvent on DiscordEvent {
          server
          serverName
          channel
          channelName
          autoSync
        }
        
        fragment OtherEvent on OtherEvent {
          link
        }`,
        'variables': { id },
        'operationName': 'getEventViewData'
      })
    })

    eventData = await eventRes.json()
  } catch (e) {
    console.warn(e)
    return
  }

  const { data } = eventData || {}

  if (data) {
    const { event: { id, status, title, info, posterUrl, registrantsCount, raffle } } = data
    const curor = 50
    const loopCount = Math.ceil(registrantsCount / curor)
    let participants = []

    try {
      for (const pageIndex of Array.from(Array(loopCount).keys())) {
        const registrantsRes = await fetch('https://api.cyberconnect.dev/profile/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'query': `
            query getRegistrants($id: ID!, $first: Int, $after: String) {
              event(id: $id) {
                registrantsCount
                registrants(first: $first, after: $after) {
                  pageInfo {
                    ...PageInfo
                  }
                  list {
                    lightInfo {
                      profileId
                      avatar
                      displayName
                      formattedAddress
                      avatarFrameTokenId
                    }
                  }
                }
              }
            }
            
            fragment PageInfo on PageInfo {
              startCursor
              endCursor
              hasNextPage
              hasPreviousPage
            }`,
            'variables': {
              first: curor.toString(),
              after: pageIndex > 0 ? (curor * (pageIndex) - 1).toString() : undefined,
              id
            },
            'operationName': 'getRegistrants'
          })
        })
        const { data } = await registrantsRes.json() || {}

        if (data?.event?.registrants?.list) {
          participants = participants.concat(data.event.registrants.list)
        }
      }
    } catch (e) {
      console.warn(e)
      return
    }

    return {
      id,
      status,
      title,
      info,
      posterUrl,
      participants,
      raffle: raffle ? {
        ...raffle.awards,
        winnersCount: raffle.winnersCount,
        joinedCount: raffle.joinedCount
      } : null
    }
  }
}
