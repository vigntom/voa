const mongoose = require('mongoose')
const User = require('../user')

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const schema = new Schema({
  from: {
    type: ObjectId,
    ref: 'User',
    required: true
  },

  to: {
    type: ObjectId,
    ref: 'User',
    required: true
  },

  subject: {
    type: String,
    required: true
  },

  body: {
    type: Object
  }
})

schema.statics.transferNotify = function ({ from, to, pollname }) {
  const subject = 'transfer'
  const body = { pollname }
  const query = { $or: [{ email: to }, { username: to }] }

  return User.findOne(query)
    .then(({ _id }) => {
      return this.create({
        from,
        to: _id,
        subject,
        body
      })
    })
}

module.exports = mongoose.model('Mailbox', schema)
