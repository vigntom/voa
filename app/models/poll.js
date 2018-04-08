const mongoose = require('mongoose')
const User = require('./user')
const Schema = mongoose.Schema

const pollSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    default: '',
    trim: true
  },

  author: {
    type: Schema.Types.ObjectId,
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

pollSchema.post('save', incUserPolls(1))
pollSchema.post('remove', incUserPolls(-1))

function incUserPolls (num) {
  return (doc) => (
    User.findOneAndUpdate({ _id: doc.author }, { $inc: { polls: num } }).exec()
  )
}

module.exports = mongoose.model('Poll', pollSchema)
