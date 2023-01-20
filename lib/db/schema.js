import mongoose from 'mongoose'

export const RecipientsSchema = new mongoose.Schema({
  _id: String,
  uid: {
    type: String,
    default: undefined,
    index: { unique: true, sparse: true }
  },
  name: String,
  desc: String,
  networkId: String,
  tokens: [String]
})
