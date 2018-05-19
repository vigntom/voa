require('../option')
require('../vote')
const mongoose = require('mongoose')
const User = require('../user')
const Schema = mongoose.Schema
const h = require('./lib/helpers')
const uniqueValidator = require('mongoose-unique-validator')
const beautifyUnique = require('mongoose-beautiful-unique-validation')

const schema = new Schema({
  name: {
    type: String,
    required: "Poll name can't be blank",
    trim: true,
    minlength: [ 1, 'Use at least 3 characters for pool name' ],
    maxlength: [ 32, 'Keep pool name within 32 characters' ],
    validate: {
      validator: x => /^[a-zA-Z0-9_-]+$/.test(x),
      message: 'Poll Name may only contain alphumeric hyphen and uderscore charactes'
    }
  },

  description: {
    type: String,
    required: "Poll without question isn't poll",
    trim: true,
    minlength: [ 1, 'Use at least 3 characters for question' ],
    maxlength: [ 128, 'Keep question within 128 characters' ]
  },

  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    requred: true
  },

  restricted: {
    type: Boolean,
    default: false
  },

  contributors: [{
    _id: false,
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],

  stargazers: {
    count: { type: Number, default: 0 },

    data: [{
      _id: false,
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }]
  }
}, {
  timestamps: true
})

schema.index({ name: 1, author: 1 }, {
  unique: 'You already use the name "{VALUE}" for another poll'
})

schema.plugin(uniqueValidator)
schema.plugin(beautifyUnique)

schema.post('save', incUserPolls(1))
schema.post('remove', incUserPolls(-1))

schema.virtual('options', {
  ref: 'Option',
  localField: '_id',
  foreignField: 'poll'
})

schema.virtual('votes', {
  ref: 'Vote',
  localField: '_id',
  foreignField: 'poll'
})

function incUserPolls (num) {
  return (doc) => (
    User.findOneAndUpdate({ _id: doc.author }, { $inc: { polls: num } }).exec()
  )
}

schema.statics.findVoter = function (cond) {
  return h.findVoter(this, cond)
}

schema.query.populateOptions = function () {
  return this.populate({
    path: 'options',
    options: { sort: 'createdAt' }
  })
}

schema.query.populateOptionsAndVotes = function () {
  return this.populate({
    path: 'options',
    populate: {
      path: 'votes'
    }
  })
}

module.exports = mongoose.model('Poll', schema)
