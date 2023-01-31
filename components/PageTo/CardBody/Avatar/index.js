import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

export default function Avatar ({ url, address }) {
  return url
    ? <img width='100%' height='100%' alt='' src={url} />
    : <Jazzicon seed={jsNumberForAddress(address)} diameter={64} />
}
