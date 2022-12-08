import mongoose from 'mongoose'

export const RecipientsSchema = new mongoose.Schema({
  _id: String,
  uid: { type: String, unique: true },
  name: String,
  desc: String,
  networkId: String,
  tokens: [String]
})
