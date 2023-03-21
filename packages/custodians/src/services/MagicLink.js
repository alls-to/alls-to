import { Magic } from 'magic-sdk'
import { ConnectExtension } from '@magic-ext/connect'
import { ethers } from 'ethers'
import BaseCustodianService from '../BaseCustodianWallet'
import icon from './icons/magic-link.png'

export default class MagicLink extends BaseCustodianService {
  constructor (props, config) {
    super(props)
    this.currentAccount = undefined
    this.config = config
    this._init()
  }

  get isCustodian () {
    return true
  }

  get id () {
    return 'magicLink'
  }

  get name () {
    return 'Magic Link'
  }

  get type () {
    return 'metamask'
  }

  get icon () {
    return icon.src
  }

  _init () {
    if (typeof window !== 'undefined') {
      const instance = new Magic(this.config.MAGIC_LINK_PUBLIC_KEY, {
        extensions: [new ConnectExtension()]
      })
      this.service = instance
      this.provider = new ethers.providers.Web3Provider(instance.rpcProvider)
    }
  }

  async disconnect () {
    await this.service.connect.disconnect()
    this.service = undefined
    this.provider = undefined
    this.currentAccount = undefined
  }

  async connect () {
    const accounts = await this.provider.listAccounts()
    this.currentAccount = {
      address: accounts[0],
      hex: accounts[0]
    }
    return {
      address: accounts[0]
    }
  }

  async glimpse () {
    // TODO: handle auth
    return this.currentAccount
  }

  async signMessage (message) {
    const params = [message, this.currentAccount.address]
    const method = 'personal_sign'
    const signature = await this.provider.send(method, params)
    return {
      signature
    }
  }
}
