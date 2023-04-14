import CustodianServiceManager from '@mesonfi/custodians'
import * as api from 'lib/api'

const PARTICLE_PROJECT_ID = process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID
const PARTICLE_CLIENT_ID = process.env.NEXT_PUBLIC_PARTICLE_CLIENT_ID
const PARTICLE_APP_ID = process.env.NEXT_PUBLIC_PARTICLE_APP_ID
const MAGIC_LINK_PUBLIC_KEY = process.env.NEXT_PUBLIC_MAGIC_LINK_PUBLIC_KEY
const DISABLE_WALLETS = process.env.NEXT_PUBLIC_DISABLE_WALLETS

const constodianConfigs = [
  {
    id: 'particle',
    config: {
      PARTICLE_PROJECT_ID,
      PARTICLE_CLIENT_ID,
      PARTICLE_APP_ID,
      signMessage: async (account) => {
        const { signature } = await api.thirdAuthVerify(account)
          return {
            signature
          }
      }
    }
  },
  {
    id: 'magicLink',
    config: {
      MAGIC_LINK_PUBLIC_KEY
    }
  }
].filter(item => !DISABLE_WALLETS?.split(',').includes(item.id))

const custodians = new CustodianServiceManager(constodianConfigs)

export default custodians
