const mongoose = require('mongoose')
const User = require('../user')
const Schema = mongoose.Schema
const Option = require('../option')
const h = require('./lib/helpers')
const beautifyUnique = require('mongoose-beautiful-unique-validation')

const pollSchema = new Schema({
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

pollSchema.plugin(beautifyUnique)

pollSchema.index({ name: 1, author: 1 }, {
  unique: 'You already use the name "{VALUE}" for another poll'
})

pollSchema.post('save', incUserPolls(1))
pollSchema.post('remove', incUserPolls(-1))

pollSchema.virtual('options', {
  ref: 'Option',
  localField: '_id',
  foreignField: 'poll'
})

function incUserPolls (num) {
  return (doc) => (
    User.findOneAndUpdate({ _id: doc.author }, { $inc: { polls: num } }).exec()
  )
}

// pollSchema.methods.addContributor = function (data) {
//   return h.findbyIdAndAddContibutor(this, this.id, data)
// }

// pollSchema.methods.movePolls = function (to) {
//   return h.movePolls(this, this.id, to)
// }

// pollSchema.statics.findbyIdAndAddContibutor = function (id, data) {
//   return h.findByIdAndAddContributor(this, id, data)
// }

// pollSchema.statics.movePolls = function (from, to) {
//   return h.movePolls(this, User, from, to)
// }

pollSchema.statics.findVoter = function (cond) {
  return h.findVoter(this, cond)
}

// pollSchema.statics.findByIdAndVote = function (id, cond) {
//   return h.findByIdAndVote(this, id, cond)
// }

// pollSchema.query.addChoiceOption = function (choice) {
//   const query = this

//   return query
//     .then(poll => {
//       return poll.update({ $push: { choices: choice } })
//     })
// }

module.exports = mongoose.model('Poll', pollSchema)
