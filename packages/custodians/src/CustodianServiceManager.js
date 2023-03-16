import MagicLink from './services/MagicLink'
import Particle from './services/Particle'

const ServicesDict = {
  magiclink: MagicLink,
  particle: Particle
}

export default class CustodianServiceManager {
  constructor () {
    this._cache = new Map()
    // TODO: update index method
    this.currentCustodian = null
  }

  get services () {
    return Object.keys(ServicesDict).map(item => {
      return this.createService(item)
    })
  }

  getService (type) {
    return this._cache.get(type) || this.createService(type)
  }

  createService (type) {
    const Service = ServicesDict[type]
    this._cache.set(type, new Service(this))
    return this._cache.get(type)
  }

  async connect (_, type, custodianId) {
    await this.disconnect()
    this.currentCustodian = this.getService(custodianId)
    return await this.currentCustodian.connect()
  }

  async disconnect () {
    await this.currentCustodian?.disconnect()
    this.currentCustodian = null
  }

  async signMessage (message) {
    return await this.currentCustodian?.signMessage(message)
  }
}
