const HORIZONTAL_ELLIPSIS = '\u2026'
export function abbreviate (address, start = 4, end = start) {
  if (!address) {
    return address
  }
  if (address.startsWith('0x')) {
    start += 2
  }
  const length = address.length
  if (length <= start + end) {
    return address
  }
  return `${address.slice(0, start)}${HORIZONTAL_ELLIPSIS}${address.slice(length - end)}`
}
