import mongoose from 'mongoose'

import {
  RecipientsSchema
} from './schema'

const db = mongoose.createConnection(process.env.MONGO_URL)
db.on('connection', () => console.log('[mongodb] App DB Connected!'))
db.on('error', err => console.warn('[mongodb] App DB', err.message))

export const Recipients = db.model('recipients', RecipientsSchema)
