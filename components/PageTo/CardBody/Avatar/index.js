import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

export default function Avatar ({ to }) {
  return to.avatar
    ? <img width='100%' height='100%' alt='' src={to.avatar} />
    : <Jazzicon seed={jsNumberForAddress(to.address)} diameter={64} />
}
