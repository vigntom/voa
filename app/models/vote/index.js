const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const beautifyUnique = require('mongoose-beautiful-unique-validation')
const { Schema } = mongoose

const schema = new Schema({
  poll: {
    type: Schema.Types.ObjectId,
    ref: 'Options',
    required: true
  },

  option: {
    type: Schema.Types.ObjectId,
    ref: 'Option',
    required: true
  },

  voter: {
    type: String,
    required: true
  },

  type: {
    type: String,
    required: true,
    enum: ['User', 'Session']
  }
})

schema.plugin(uniqueValidator)
schema.plugin(beautifyUnique)

schema.index({ poll: 1, voter: 1 }, {
  unique: 'Already voted'
})

module.exports = mongoose.model('Vote', schema)
