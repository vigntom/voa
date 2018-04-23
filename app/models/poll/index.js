const mongoose = require('mongoose')
const User = require('../user')
const Schema = mongoose.Schema
const h = require('./lib/helpers')

const pollSchema = new Schema({
  name: {
    type: String,
    required: "Poll name can't be blank",
    trim: true,
    minlength: [ 1, 'Use at least 3 characters for pool name' ],
    maxlength: [ 32, 'Keep pool name within 32 characters' ]
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

  choices: [{
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
    },

    votes: [{
      _id: false,

      voter: { type: String, required: true },

      type: {
        type: String,
        required: true,
        enum: ['User', 'Session']
      }
    }]
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

pollSchema.path('name').validate(nameValidator)
pollSchema.pre('validate', choicesValidator)
pollSchema.post('save', incUserPolls(1))
pollSchema.post('remove', incUserPolls(-1))

pollSchema.methods.addContributor = function (data) {
  return h.findbyIdAndAddContibutor(this.model('Poll'), this.id, data)
}

pollSchema.methods.movePolls = function (to) {
  return h.movePolls(this.model('Poll'), this.id, to)
}

pollSchema.statics.findbyIdAndAddContibutor = function (id, data) {
  return h.findByIdAndAddContributor(this.model('Poll'), id, data)
}

pollSchema.statics.movePolls = function (from, to) {
  return h.movePolls(this.model('Poll'), User, from, to)
}

pollSchema.statics.findVoter = function (cond) {
  return h.findVoter(this.model('Poll'), cond)
}

pollSchema.statics.findByIdAndVote = function (id, cond) {
  return h.findByIdAndVote(this.model('Poll'), id, cond)
}

function incUserPolls (num) {
  return (doc) => (
    User.findOneAndUpdate({ _id: doc.author }, { $inc: { polls: num } }).exec()
  )
}

function nameValidator (value) {
  const enabledChars = /^[a-zA-Z0-9_-]+/

  if (!enabledChars.test(value)) {
    return this.invalidate('name', 'Poll Name may only contain alpahumeric' +
      ' hyphen and uderscore charactes')
  }

  return this.model('Poll').count({ author: this.author, name: this.name })
    .then(count => {
      if (count > 0) {
        return this.invalidate('name', 'Author/name must be unique')
      }
    })
    .catch(err => {
      return this.invalidate('name', err.message)
    })
}

function choicesValidator (next) {
  let dupIndexes = []
  const choices = this.choices.map(x => x.name)

  if (choices.length < 2) {
    this.invalidate('choices', 'Must be at least 2 choices')
    return next()
  }

  choices.forEach((x, i) => {
    if (choices.filter(y => x === y).length > 1) {
      dupIndexes.push(i)
    }
  })

  dupIndexes.forEach(i => {
    this.invalidate(`choices.${i}.name`, 'Choice name must be unique for current poll')
  })

  next()
}

module.exports = mongoose.model('Poll', pollSchema)