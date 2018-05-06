const mongoose = require('mongoose')
const beautifyUnique = require('mongoose-beautiful-unique-validation')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema
require('../vote')

const schema = new Schema({
  poll: {
    type: Schema.Types.ObjectId,
    ref: 'Poll',
    required: true
  },

  name: {
    type: String,
    required: "Choice name can't be blank",
    trim: true,
    minlenth: [1, 'Use at leas 1 character for choice name'],
    maxlength: [64, 'Keep choice name within 64 characters']
  },

  description: {
    type: String,
    default: '',
    trim: true,
    maxlength: 254
  }
})

schema.plugin(uniqueValidator)
schema.plugin(beautifyUnique)

schema.index({ poll: 1, name: 1 }, {
  unique: 'Too many options with name "{VALUE}"'
})

schema.virtual('votes', {
  ref: 'Vote',
  localField: '_id',
  foreignField: 'option'
})

module.exports = mongoose.model('Option', schema)
