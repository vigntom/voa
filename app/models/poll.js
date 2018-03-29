const mongoose = require('mongoose')

const Schema = mongoose.Schema

const pollSchema = new Schema({
  subject: {
    type: String,
    required: true,
    trim: true
  },

  author: {
    type: Schema.ObjectId,
    ref: 'User',
    requred: true
  },

  choices: [{
    key: {
      type: String,
      required: true,
      trim: true
    },

    value: {
      type: Number,
      default: 0
    }
  }],

  stargazers: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Poll', pollSchema)
