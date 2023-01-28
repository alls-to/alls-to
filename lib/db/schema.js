import mongoose from 'mongoose'

export const RecipientsSchema = new mongoose.Schema({
  _id: String,
  uid: {
    type: String,
    default: undefined,
    index: { unique: true, sparse: true }
  },
  name: String,
  bio: String,
  networkId: String,
  avatar: String,
  tokens: [String],
  did: String,
  clicks: Number
}, {
  toJSON: { getters: true },
  timestamps: { createdAt: 'created', updatedAt: 'updated' }
})
RecipientsSchema.path('created').get(d => d && Math.floor(d.valueOf() / 1000))
RecipientsSchema.path('updated').get(d => d && Math.floor(d.valueOf() / 1000))
