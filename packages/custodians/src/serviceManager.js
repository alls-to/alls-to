import MagicLink from './services/magicLink'
import Particle from './services/particle'

const ServicesDict = {
  magiclink: MagicLink,
  particle: Particle
}

export default class ServiceManager {
  constructor () {
    this._cache = new Map()
    // TODO: update index method
    this.currentExt = null
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

  async connect (_, extType, extId) {
    await this.disconnect()
    this.currentExt = this.getService(extId)
    return await this.currentExt.connect()
  }

  async disconnect () {
    await this.currentExt?.disconnect()
    this.currentExt = null
  }

  async signMessage (message) {
    return await this.currentExt?.signMessage(message)
  }
}
