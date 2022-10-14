import MetaMask from './MetaMask'
import TronLink from './TronLink'

import Detector from './Detector'

export class BrowserExtensions {
  constructor () {
    this.ext = null
  }

  detect (window) {
    const detector = new Detector(window)
    return detector.getExtentions()
  }

  _getExtentionClass (extType) {
    switch (extType) {
      case 'metamask':
        return [MetaMask, window.ethereum]
      case 'tronlink':
        return [TronLink, window.tronLink]
      default:
        return []
    }
  }

  get chainId () {
    return this.ext?.chainId
  }

  getAddress () {
    return this.ext.currentAccount?.hex
  }

  get provider () { return this.ext.provider }

  getName (extType) {
    const [Extension] = this._getExtentionClass(extType)
    return Extension?.Name || ''
  }

  isExtensionInstalled (extType) {
    return !this._getExtentionClass(extType)[1]
  }

  async connect (extType, onChange) {
    this.disconnect()

    const [Extension, injected] = this._getExtentionClass(extType)
    if (!Extension) {
      throw new Error('Fail to connect to the browser extension. Invalid extension')
    }

    this.ext = new Extension(injected, extType)

    await this.ext.enable((chainId, account) => {
      if (!chainId) {
        this.disconnect()
        return
      }
      onChange(chainId, account)
    })
  }

  disconnect () {
    if (this.ext) {
      this.ext.dispose()
      this.ext = null
    }
  }

  async switch (networkId) {
    if (!this.ext) {
      return
    }
    if (this._getExtentionClassFromNetworkId(networkId).indexOf(this.ext.type) === -1) {
      this.disconnect()
    } else {
      const network = presets.getNetwork(networkId)
      await this.ext.switch(network)
    }
  }

  async sign (msg) {
    return await this.ext.sign(msg)
  }

  async signMessage (msg) {
    return await this.ext.signMessage(msg)
  }

  async signTypedData (data) {
    return await this.ext.signTypedDataV1(data)
  }

  async sendTransaction (tx) {
    return await this.ext.sendTransaction(tx)
  }
}

export default new BrowserExtensions()
