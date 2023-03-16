import mongoose from 'mongoose'
import pick from 'lodash/pick'

export const AllsToSchema = new mongoose.Schema({
  addr: { type: String, index: true },
  key: {
    type: String,
    index: { unique: true, sparse: true }
  },
  did: { type: String, default: '' },
  name: { type: String, default: '' },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  socials: Array,
  networkId: { type: String, default: 'polygon' },
  tokens: [String],
  clicks: Number
}, {
  toObject: { getters: true, virtuals: true },
  timestamps: { createdAt: 'created', updatedAt: 'updated' }
})
AllsToSchema.path('key').get(v => v || '')
AllsToSchema.path('socials').get(v => v || null)
AllsToSchema.path('updated').get(d => d && Math.floor(d.valueOf() / 1000))
AllsToSchema.path('updated').get(d => d && Math.floor(d.valueOf() / 1000))
AllsToSchema.virtual('handle').get(function() {
  return this.key ? this.key.substring(0, this.key.lastIndexOf('.')) : this.addr.substring(0, 12)
})
AllsToSchema.method('toJSON', function() {
  return pick(this, 'addr key did handle name avatar bio socials networkId tokens'.split(' '))
})
