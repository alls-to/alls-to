import MagicLink from './services/MagicLink'
import Particle from './services/Particle'

export const ServicesDict = {
  magicLink: MagicLink,
  particle: Particle
}

export default class CustodianServiceManager {
  constructor (options) {
    this._cache = new Map()
    // use `currentExt` as variable temporarily, in many other places used it.
    this.currentExt = null
    this.options = options
  }

  get services () {
    return Object.keys(ServicesDict).map( id => this.createService(id))
  }

  getService (custodianId) {
    return this._cache.get(custodianId) || this.createService(custodianId)
  }

  createService (custodianId) {
    // custodianId might be the non-custodial waller.
    const Service = ServicesDict[custodianId]
    if (Service) {
      const config = this.options?.[custodianId]
      if (!config) {
        console.warn(`${custodianId} does not have any config.`)
      }
      this._cache.set(custodianId, new Service(this, config))
      return this._cache.get(custodianId)
    }
  }

  async connect (_, type, custodianId) {
    // TODO: check the custodianId, need to filter the extension id
    if (!Object.keys(ServicesDict).includes(custodianId)) {
      return
    }
    this.currentExt = this.getService(custodianId)
    const addr = await this.currentExt.connect()
    this._cache.set(custodianId, this.currentExt)
    return addr
  }

  async disconnect () {
    await this.currentExt?.disconnect()
    this.currentExt = null
  }

  async signMessage (message) {
    return await this.currentExt?.signMessage(message)
  }
}
