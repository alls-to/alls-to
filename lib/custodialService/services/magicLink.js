import { Magic } from 'magic-sdk'
import { ConnectExtension } from "@magic-ext/connect"
import { ethers } from "ethers"

export default class MagicLinkService {
  constructor() {
    this._init()
    this.currentAccount = undefined
  }

  get name () {
    return 'Magic Link'
  }

  get type() {
    return 'Magic.link'
  }

  // TODO
  get icon() {
    return ''
  }

  _init() {
    if (typeof window !== 'undefined') {
      const instance = new Magic('pk_live_5C4259AB7379B5C7', {
        extensions: [new ConnectExtension()]
      })
      this.service = instance
      this.provider = new ethers.providers.Web3Provider(instance.rpcProvider);
    }
  }

  async disconnect() {
    return await this.service.connect.disconnect()
  }

  async connect() {
    const accounts = await this.provider.listAccounts()
    this.currentAccount = {
      address: accounts[0]
    }
    return {
      address: accounts[0]
    }
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
