const mongoose = require('mongoose')
const User = require('../user')
const Schema = mongoose.Schema
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

pollSchema.index({ name: 1, author: 1 }, {
  unique: 'You already use the name "{VALUE}" for another poll'
})

pollSchema.plugin(beautifyUnique)

pollSchema.post('validate', choicesValidator)
pollSchema.post('save', incUserPolls(1))
pollSchema.post('remove', incUserPolls(-1))
pollSchema.pre('update', choiceValidatorByQuery)

pollSchema.methods.addContributor = function (data) {
  return h.findbyIdAndAddContibutor(this, this.id, data)
}

pollSchema.methods.movePolls = function (to) {
  return h.movePolls(this, this.id, to)
}

pollSchema.statics.findbyIdAndAddContibutor = function (id, data) {
  return h.findByIdAndAddContributor(this, id, data)
}

pollSchema.statics.movePolls = function (from, to) {
  return h.movePolls(this, User, from, to)
}

pollSchema.statics.findVoter = function (cond) {
  return h.findVoter(this, cond)
}

pollSchema.statics.findByIdAndVote = function (id, cond) {
  return h.findByIdAndVote(this, id, cond)
}

function incUserPolls (num) {
  return (doc) => (
    User.findOneAndUpdate({ _id: doc.author }, { $inc: { polls: num } }).exec()
  )
}

function choiceValidatorByQuery () {
  const query = this
  const model = query.model
  const update = query.getUpdate()

  if (update.$push && update.$push.choices) {
    const choice = update.$push.choices
    const name = choice.name
    const cond = query.getQuery()

    if (!name) {
      const msg = "Choice name can't be blank"
      const error = model().invalidate('choices', msg)
      query.error(error)
      return null
    }

    return model.findOne(cond).where('choices').elemMatch({ name })
      .then(poll => {
        if (poll) {
          const msg = 'Choice name must be unique'
          const error = model().invalidate('choices', msg)
          query.error(error)
        }
      })
  }
}

function choicesValidator (doc) {
  let dupIndexes = []
  const choices = doc.choices.map(x => x.name)

  if (choices.length < 2) {
    doc.invalidate('choices', 'Must be at least 2 choices')
  }

  choices.forEach((x, i) => {
    if (choices.filter(y => x === y).length > 1) {
      dupIndexes.push(i)
    }
  })

  dupIndexes.forEach(i => {
    doc.invalidate(`choices.${i}.name`, 'Choice name must be unique for current poll')
  })
}

pollSchema.query.addChoiceOption = function (choice) {
  const query = this

  return query
    .then(poll => {
      return poll.update({ $push: { choices: choice } })
    })
}

module.exports = mongoose.model('Poll', pollSchema)
