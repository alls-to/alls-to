import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

export default function Avatar ({ url, addr }) {
  return url
    ? <img className='w-full h-full' alt='' src={url} />
    : <Jazzicon seed={jsNumberForAddress(addr)} diameter={64} />
}
