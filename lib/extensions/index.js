import mesonPresets from '@mesonfi/presets'
import MultiExtensionManager from '@mesonfi/extensions'

class ExtendedExtensionManager extends MultiExtensionManager {}

const extensions = new ExtendedExtensionManager(global.window, mesonPresets)

export default extensions
