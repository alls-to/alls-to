const { AllsToSchema } = require('../lib/db/schema')
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.pluralize(null)
const db = mongoose.createConnection(process.env.MONGO_URL)
db.on('connection', () => console.log('[mongodb] DB Connected!'))
db.on('error', err => console.warn('[mongodb] DB', err.message))

const AllsTo = db.model('alls.to', AllsToSchema)
const main = async () => {
  const list = await AllsTo.find({ key: /#/ })

  for (const item of list) {
    const oldKey = item.key
    let newKey

    if (oldKey.endsWith('#cyber')) {
      const handle = oldKey.substring(0, oldKey.lastIndexOf('#'))
      if (!handle.endsWith('.cyber')) {
        newKey = `${handle}.cyber`
      } else {
        newKey = handle
      }
    } else if (oldKey.endsWith('#dotbit')) {
      const handle = oldKey.substring(0, oldKey.lastIndexOf('#'))
      if (!handle.endsWith('.bit')) {
        newKey = `${handle}.bit`
      } else {
        newKey = handle
      }
    }
    console.log(item.did, oldKey, `->`, newKey)
    await AllsTo.findOneAndUpdate({
      key: oldKey
    }, {
      key: newKey
    })
  }
  mongoose.disconnect()
}

main()
