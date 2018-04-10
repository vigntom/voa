const mongoose = require('mongoose')
const User = require('./user')
const Schema = mongoose.Schema

const pollSchema = new Schema({
  name: {
    type: String,
    required: "Poll name can't be blank",
    trim: true
  },

  description: {
    type: String,
    required: "Poll description can't be blank",
    trim: true
  },

  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    requred: true
  },

  choices: [{
    name: {
      type: String,
      required: "Choice name can't be blank",
      trim: true
    },

    description: {
      type: String,
      default: '',
      trim: true
    },

    votes: [{
      voter: {
        type: Schema.Types.ObjectId,
        required: true
      },

      type: {
        type: String,
        required: true,
        enum: ['User', 'Session']
      }
    }]
  }],

  stargazers: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

pollSchema.pre('validate', nameValidator)
pollSchema.pre('validate', choicesValidator)

pollSchema.post('save', incUserPolls(1))
pollSchema.post('remove', incUserPolls(-1))

function incUserPolls (num) {
  return (doc) => (
    User.findOneAndUpdate({ _id: doc.author }, { $inc: { polls: num } }).exec()
  )
}

function nameValidator (next) {
  return this.model('Poll').count({ author: this.author, name: this.name })
    .then(count => {
      if (count > 0) {
        this.invalidate('name', 'Author/name must be unique')
      }

      next()
    })
    .catch(next)
}

function choicesValidator (next) {
  let dupIndexes = []
  const choices = this.choices.map(x => x.name)

  if (choices.length < 2) {
    this.invalidate('choices', 'Must be at least 2 choices')
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
