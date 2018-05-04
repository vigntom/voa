const mongoose = require('mongoose')
const beautifyUnique = require('mongoose-beautiful-unique-validation')
const { Schema } = mongoose

const schema = new Schema({
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

schema.plugin(beautifyUnique)

schema.index({ option: 1, voter: 1 }, {
  unique: 'You already voted'
})

module.exports = mongoose.model('Vote', schema)
