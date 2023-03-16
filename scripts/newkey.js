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

    if (oldKey.endsWith('#link3')) {
      const handle = oldKey.substring(0, oldKey.lastIndexOf('#'))
      console.log('handle', handle)
      newKey = `${handle}.cyber`
    } else if (oldKey.endsWith('#dotbit')) {
      const handle = oldKey.substring(0, oldKey.lastIndexOf('#'))
      console.log('handle', handle)
      if (!handle.endsWith('.bit')) {
        newKey = `${handle}.bit`
      }
      newKey = `${handle}`
    }
    console.log('newKey', newKey)
    await AllsTo.findOneAndUpdate({
      addr: item.addr
    }, {
      key: newKey
    })
  }
  mongoose.disconnect()
}

main()
