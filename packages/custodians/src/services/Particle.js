import { ParticleNetwork, WalletEntryPosition } from '@particle-network/auth'
import { ParticleProvider } from '@particle-network/provider'
import { ethers } from 'ethers'
import BaseCustodianService from '../BaseCustodianWallet'
import icon from './icons/particle-network.png'

export default class Particle extends BaseCustodianService {
  constructor (props, config) {
    super(props)
    this.currentAccount = undefined
    this.preferredAuthType = undefined
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
    return 'particle'
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
    if (!this.preferredAuthType) {
      return
    }
    const isLogin = this.service.auth.isLogin()
    const userInfo = isLogin ? this.service.auth.userInfo() : await this.service.auth.login({
      preferredAuthType: this.preferredAuthType,
      socialLoginPrompt: 'consent'
    })
    window.localStorage.setItem('isPersonalSign', '0')
    const { uuid, token } = userInfo
    const currentAddr = userInfo.wallets.find(item => item.chain_name === 'evm_chain').public_address.toLowerCase()

    this.currentAccount = {
      address: currentAddr,
      hex: currentAddr,
      sub: currentAddr,
      uuid,
      token,
      iss: `${this.type}:${this.id}`
    }
    return this.currentAccount
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


  async signMessage() {
    if (this.config.signMessage) {
      return await this.config.signMessage(this.currentAccount)
    } else {
      throw new Error('signMessage method not implement.')
    }
  }
}
