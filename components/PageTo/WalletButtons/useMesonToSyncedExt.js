import React from 'react'
import mesonPresets from '@mesonfi/presets'

export default function useMesonToSyncedExt () {
  const [networkId, setNetworkId] = React.useState('eth')
  const [extStatus, setExtStatus] = React.useState()

  const onMeson2Event = React.useCallback(({ data }) => {
    if (data.type === 'update-ext-status') {
      setExtStatus(data.data)
    } else if (data.type === 'switch-network') {
      setNetworkId(data.data)
    }
  }, [])

  const extId = extStatus?.extId

  React.useEffect(() => {
    window.addEventListener('meson.to', onMeson2Event)
    return () => window.removeEventListener('meson.to', onMeson2Event)
  }, [onMeson2Event])

  const supportedExts = React.useMemo(() => {
    if (!networkId) {
      return
    }
    const network = mesonPresets.getNetwork(networkId)
    return network?.extensions
  }, [networkId])

  const connect = React.useCallback(_extId => {
    window.postMessage({ to: 'meson.to', event: 'ext-connect', params: _extId || extId })
  }, [extId])

  const disconnect = React.useCallback(() => {
    window.postMessage({ to: 'meson.to', event: 'ext-disconnect' })
  }, [])

  return { networkId, supportedExts, extId, extStatus, connect, disconnect }
}
