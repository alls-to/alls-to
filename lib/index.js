const HORIZONTAL_ELLIPSIS = '\u2026'
export function abbreviate (addr, start = 4, end = start) {
  if (!addr) {
    return addr
  }
  if (addr.startsWith('0x')) {
    start += 2
  }
  const length = addr.length
  if (length <= start + end) {
    return addr
  }
  return `${addr.slice(0, start)}${HORIZONTAL_ELLIPSIS}${addr.slice(length - end)}`
}
