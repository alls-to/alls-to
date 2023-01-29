import React from 'react'

import presets from '@mesonfi/presets'

import { disabledChains } from 'lib/extensions'

import Input from 'components/common/Input'
import NetworkIcon from 'components/common/Icon/NetworkIcon'

import TokenSelector from './TokenSelector'

export default React.forwardRef(BodyPartReceive)

function BodyPartReceive({ to, onModified, account }, ref) {
  const [networkId, setNetworkId] = React.useState(to.networkId || '')
  const [tokens, setTokens] = React.useState(to.tokens)

  React.useImperativeHandle(ref, () => ({
    getData: () => ({ networkId, tokens })
  }))

  const extType = account?.iss?.split(':')[0]
  const networks = React.useMemo(() => {
    if (!extType) {
      return []
    }
    return presets.getAllNetworks()
      .filter(n => !disabledChains.includes(n.id))
      .filter(n => n.extensions.includes(extType))
  }, [extType])

  const defaultNetworkId = !networkId && networks[0]?.id
  React.useEffect(() => {
    if (defaultNetworkId) {
      setNetworkId(defaultNetworkId)
      onModified(to => ({ ...to, networkId: defaultNetworkId }))
    }
  }, [defaultNetworkId, onModified])

  const updateNetworkId = React.useCallback(networkId => {
    setNetworkId(networkId)
    onModified(to => ({ ...to, networkId }))
  }, [onModified])

  const updateTokens = React.useCallback(tokens => {
    setTokens(tokens)
    onModified(to => ({ ...to, tokens }))
  }, [onModified])

  return (
    <>
      <Input
        id='chain'
        className='mt-5 mb-3'
        inputClassName='pl-11'
        type='select'
        label='Receive Stablecoins as'
        value={networkId}
        onChange={updateNetworkId}
        options={networks}
      >
        <div className='absolute left-4 bottom-[10px]'>
          <NetworkIcon size={22} id={networkId} />
        </div>
      </Input>

      <TokenSelector
        networkId={networkId}
        tokens={tokens}
        onChange={updateTokens}
      />
    </>
  )
}
