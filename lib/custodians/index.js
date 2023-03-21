import CustodianServiceManager from '@mesonfi/custodians'

const PARTICLE_PROJECT_ID = process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID
const PARTICLE_CLIENT_ID = process.env.NEXT_PUBLIC_PARTICLE_CLIENT_ID
const PARTICLE_APP_ID = process.env.NEXT_PUBLIC_PARTICLE_APP_ID
const MAGIC_LINK_PUBLIC_KEY = process.env.NEXT_PUBLIC_MAGIC_LINK_PUBLIC_KEY

const constodianConfigs = {
  particle: {
    PARTICLE_PROJECT_ID,
    PARTICLE_CLIENT_ID,
    PARTICLE_APP_ID
  },
  magicLink: {
    MAGIC_LINK_PUBLIC_KEY
  }
}

const custodians = new CustodianServiceManager(constodianConfigs)

export default custodians
