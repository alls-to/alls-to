import { ParticleNetwork, WalletEntryPosition } from '@particle-network/auth'
import { ParticleProvider } from '@particle-network/provider'
import { ethers } from 'ethers'
import BaseCustodianService from '../BaseCustodianWallet'
import icon from './icons/particle-network.png'

export default class Particle extends BaseCustodianService {
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
    return 'particle'
  }

  get name () {
    return 'Particle Network'
  }

  get type () {
    return 'metamask'
  }

  get icon () {
    return icon.src
  }

  _init () {
    if (typeof window !== 'undefined') {
      const instance = new ParticleNetwork({
        projectId: this.config.PARTICLE_PROJECT_ID,
        clientKey: this.config.PARTICLE_CLIENT_ID,
        appId: this.config.PARTICLE_APP_ID,
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
    console.log('disconnect')
    await this.service.auth.logout()
    this.currentAccount = undefined
  }

  async connect () {
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

  async glimpse () {
    if (this.service.auth.isLogin()) {
      const accounts = await this.provider.listAccounts()
      const currentAddr = accounts[0].toLowerCase()
      this.currentAccount = {
        address: currentAddr,
        hex: currentAddr
      }
      return this.currentAccount
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