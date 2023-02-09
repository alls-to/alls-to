import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import TronWeb from 'tronweb'

export default function Avatar ({ url, addr, diameter = 64 }) {
  if (addr?.startsWith('T')) {
    addr = TronWeb.address.toHex(addr).replace('41', '0x')
  }
  return url
    ? <img className='w-full h-full' alt='' src={url} />
    : <Jazzicon seed={jsNumberForAddress(addr)} diameter={diameter} />
}
