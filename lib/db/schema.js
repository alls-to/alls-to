import mongoose from 'mongoose'

export const RecipientsSchema = new mongoose.Schema({
  _id: String,
  address: String,
  chain: String,
  tokens: [String]
})
