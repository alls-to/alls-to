import coinbase from './icons/coinbase.png'
import fluent from './icons/fluent.png'
import imtoken from './icons/imtoken.png'
import itoken from './icons/itoken.png'
import metamask from './icons/metamask.png'
import rabby from './icons/rabby.png'
import tokenpocket from './icons/tokenpocket.png'
import trust from './icons/trust.png'

export default class Detector {
  constructor (window) {
    this.window = window
    if (typeof window !== 'undefined') {
      // Check mobile platform
      const platform = window.navigator.userAgentData?.platform || window.navigator?.platform || 'unknown'
      this._isIOS = /(iPhone|iPad|iPod)/.test(platform)
      this._isAndroid = /(Linux arm|Linux aar|Android)/.test(platform)

      // Check browser
      const userAgent = window.navigator.userAgent

      this._isBrave = /Brave/.test(userAgent)
      this._isChrome = /Chrome/.test(userAgent)
      this._isEdge = /Edge/.test(userAgent)
      this._isFirefox = /Firefox/.test(userAgent)
    }
  }

  get isIOS () {
    return this._isIOS
  }

  get isAndroid () {
    return this._isAndroid
  }

  get isMobile () {
    return this.isIOS || this.isAndroid
  }

  get isBrave () {
    return this._isBrave
  }

  get isChrome () {
    return this._isChrome
  }

  get isEdge () {
    return this._isEdge
  }

  get isFirefox () {
    return this._isFirefox
  }

  get hasInjection () {
    return !!window.ethereum
  }

  get isMobileWallet () {
    return this.isMobile && this.hasInjection
  }

  getExtentions () {
    if (!this.window) {
      return []
    }

    const exts = []
    if (this.window.ethereum) {
      const detected = this.detectInjection(this.window.ethereum)
      exts.push({ type: 'metamask', ...detected })
    }
    if (this.window.tronLink) {

    }
    return exts
  }

  detectInjection (web3 = window.ethereum) {
    let injected = {
      name: 'Wallet',
      id: 'web3',
      icon: metamask
    }

    if (!web3) {
      injected = {
        name: 'MetaMask',
        id: 'metamask',
        icon: metamask
      }
    } else if (web3.isRabby) {
      injected = {
        name: 'Rabby',
        id: 'rabby',
        icon: rabby
      }
    } else if (web3.isCoinbaseWallet) {
      injected = {
        name: 'Coinbase Wallet',
        id: 'coinbase',
        icon: coinbase
      }
    } else if (web3.isFluent) {
      injected = {
        name: 'Fluent',
        id: 'fluent',
        icon: fluent
      }
    } else if (web3.isTokenPocket) {
      injected = {
        name: 'TokenPocket',
        id: 'tokenpocket',
        icon: tokenpocket
      }
    } else if (web3.isTrust) {
      injected = {
        name: 'Trust Wallet',
        id: 'trustwallet',
        icon: trust
      }
    } else if (web3.isHbWallet) {
      injected = {
        name: 'iToken',
        id: 'itoken',
        icon: itoken
      }
    } else if (web3.isImToken) {
      injected = {
        name: 'imToken',
        id: 'imtoken',
        icon: imtoken
      }
    } else if (web3.isMetaMask) {
      injected = {
        name: 'MetaMask',
        id: 'metamask',
        icon: metamask
      }
    } else if (web3.isStatus) {
      injected = {
        name: 'Status',
        id: 'status',
        icon: 'ipfs://QmWQhPEvpEH3xW8wwuTr9G5vsUz8ufy25dqe394UJzwsXE'
      }
    } else if (web3.isFrame) {
      injected = {
        name: 'Frame',
        id: 'frame',
        icon: 'ipfs://QmReuKRvC7YTTEmW521nKJwEMFuocWgM9GYwUFedF6Q1BL'
      }
    } else if (web3.isAlphaWallet) {
      injected = {
        name: 'AlphaWallet',
        id: 'alphawallet',
        icon: 'ipfs://QmT7mrsAgpu4V2UJAukaEU9V6fEWYHAo7aahUxfyDdBns9'
      }
    } else if (web3.isBitpie) {
      injected = {
        name: 'Bitpie',
        id: 'bitpie',
        icon: 'ipfs://QmVUZ8gznsZ2nNv85GFZuTQj31YenyUi5K4HGfhXB3jrAF'
      }
    } else if (web3.isTally) {
      injected = {
        name: 'Tally',
        id: 'tally',
        icon: 'ipfs://Qma4EJoXZ2CyPfKQHbtjqnLVXP28xFwiXg3KwZa7nMZC19'
      }
    }

    return injected
  }
}
