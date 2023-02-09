import MagicLink from './services/magicLink'

const ServicesDict = {
  magicLink: MagicLink
}

export default class ServiceManager {
  constructor () {
    this._cache = new Map()
    // TODO: update index method
    this.currentExt = this.services[0]
  }

  get services() {
    return Object.keys(ServicesDict).map(item => {
      return this.createService(item)
    })
  }

  getService(type) {
    return this._cache.get(type)
  }

  createService(type) {
    const Service = ServicesDict[type]
    this._cache.set(type, new Service(this))
    return this._cache.get(type)
  }

  async connect() {
    return await this.currentExt.connect()
  }

  async disconnect() {
    await this.currentExt.disconnect()
  }

  async signMessage(message) {
    return await this.currentExt.signMessage(message)
  }
}
