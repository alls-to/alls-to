import mesonPresets from '@mesonfi/presets'
import MultiExtensionManager from '@mesonfi/extensions'

export const disabledChains = (process.env.NEXT_PUBLIC_DISABLED_CHAINS || '').split(',')
 
class ExtendedExtensionManager extends MultiExtensionManager {
  getDefaultExtensions (networkId) {
    return super.getDefaultExtensions(networkId).filter(ext => ext.type !== 'walletconnect')
  }
}

const extensions = new ExtendedExtensionManager(global.window, mesonPresets, disabledChains)

export default extensions
