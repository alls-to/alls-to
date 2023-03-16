import { Magic } from 'magic-sdk'
import { ConnectExtension } from '@magic-ext/connect'
import { ethers } from 'ethers'

import BaseCustodianService from '../BaseCustodianService'

const MAGIC_LINK_PUBLIC_KEY = process.env.NEXT_PUBLIC_MAGIC_LINK_PUBLIC_KEY

export default class MagicLink extends BaseCustodianService {
  constructor () {
    this.currentAccount = undefined
    this.service = undefined
    this.provider = undefined
  }

  get id () {
    return 'magiclink'
  }

  get name () {
    return 'Magic Link'
  }

  get type () {
    return 'metamask'
  }

  // TODO: return base64 or svg file name
  get icon () {
    return ''
  }

  _init () {
    if (typeof window !== 'undefined') {
      const instance = new Magic(MAGIC_LINK_PUBLIC_KEY, {
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
    this._init()

    const accounts = await this.provider.listAccounts()
    this.currentAccount = {
      address: accounts[0],
      hex: accounts[0]
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
