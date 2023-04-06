import mongoose from 'mongoose'

import {
  AllsToSchema,
  AllsToEventsSchema
} from './schema'

mongoose.pluralize(null)
const db = mongoose.createConnection(process.env.MONGO_URL)
db.on('connection', () => console.log('[mongodb] DB Connected!'))
db.on('error', err => console.warn('[mongodb] DB', err.message))

export const AllsTo = db.model('alls.to', AllsToSchema)
export const AllsToEvents = db.model('alls.to_events', AllsToEventsSchema)
