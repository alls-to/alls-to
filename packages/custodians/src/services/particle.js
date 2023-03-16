import { ParticleNetwork, WalletEntryPosition } from '@particle-network/auth'
import { ParticleProvider } from '@particle-network/provider'
import { ethers } from 'ethers'

import BaseCustodianService from '../BaseCustodianService'

const PARTICLE_PROJECT_ID = process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID
const PARTICLE_CLIENT_ID = process.env.NEXT_PUBLIC_PARTICLE_CLIENT_ID
const PARTICLE_APP_ID = process.env.NEXT_PUBLIC_PARTICLE_APP_ID

export default class Particle extends BaseCustodianService {
  constructor () {
    this.currentAccount = undefined
    this.service = undefined
    this.provider = undefined
  }

  get id () {
    return 'particle'
  }

  get name () {
    return 'Particle Network'
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
      const instance = new ParticleNetwork({
        projectId: PARTICLE_PROJECT_ID,
        clientKey: PARTICLE_CLIENT_ID,
        appId: PARTICLE_APP_ID,
        chainName: 'Ethereum',
        chainId: 1,
        wallet: {
          displayWalletEntry: true,
          defaultWalletEntryPosition: WalletEntryPosition.BR,
          supportChains: [{ id: 1, name: 'Ethereum' }, { id: 5, name: 'Ethereum' }],
          customStyle: {},
        }
      })
      this.service = instance
      const particleProvider = new ParticleProvider(instance.auth)
      this.provider = new ethers.providers.Web3Provider(particleProvider, 'any')
    }
  }

  async disconnect () {
    await this.service.auth?.logout()
    this.service = undefined
    this.provider = undefined
    this.currentAccount = undefined
  }

  async connect () {
    this._init()

    const accounts = await this.provider.listAccounts()
    const currentAddr = accounts[0].toLowerCase()
    this.currentAccount = {
      address: currentAddr,
      hex: currentAddr
    }
    return {
      address: currentAddr
    }
  }

  async signMessage (message) {
    const signature = await this.provider.send('personal_sign', [
      message, this.currentAccount.address
    ])

    return {
      signature
    }
  }
}
