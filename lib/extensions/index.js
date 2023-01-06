import mesonPresets from '@mesonfi/presets'
import MultiExtensionManager from '@mesonfi/extensions'

class ExtendedExtensionManager extends MultiExtensionManager {
  getDefaultExtensions (networkId) {
    return super.getDefaultExtensions(networkId).filter(ext => ext.type !== 'walletconnect')
  }
}

const extensions = new ExtendedExtensionManager(global.window, mesonPresets)

export default extensions
