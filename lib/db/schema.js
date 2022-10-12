const mongoose = require('mongoose')

exports.RecipientsSchema = new mongoose.Schema({
  _id: String,
  chain: String,
  tokens: [String]
})
