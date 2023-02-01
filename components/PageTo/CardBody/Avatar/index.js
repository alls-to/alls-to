import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

export default function Avatar ({ url, addr }) {
  return url
    ? <img width='100%' height='100%' alt='' src={url} />
    : <Jazzicon seed={jsNumberForAddress(addr)} diameter={64} />
}
