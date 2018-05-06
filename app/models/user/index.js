const mongoose = require('mongoose')
const { isEmail } = require('validator')
const uniqueValidator = require('mongoose-unique-validator')
const beautifyUnique = require('mongoose-beautiful-unique-validation')
const authenticationPlugin = require('./plugins/authentication')
const pollsPlugin = require('./plugins/polls')
const friendsPlugin = require('./plugins/friends')
const helpers = require('./plugins/helpers')

const Schema = mongoose.Schema

const schema = new Schema({
  username: {
    type: String,
    unique: 'Username {VALUE} already taken',
    required: "Username can't be blank",
    trim: true,
    minlength: [ 1, 'Username is too short. Use at least 1 characters.' ],
    maxlength: [ 32, 'Username is too long. Limit it to 32 characters.' ]
  },

  email: {
    type: String,
    unique: 'Email {VALUE} already in use',
    required: "Email can't be blank",
    trim: true,
    maxlength: [ 64, 'Email address is unreasonable long. Limit it to 64 characters.' ],
    lowercase: true
  },

  emailProtected: {
    type: Boolean,
    default: true
  },

  admin: {
    type: Boolean,
    default: false
  },

  protected: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
})

schema.path('email').validate(emailValidator)
schema.path('username').validate(usernameValidator)

schema.plugin(authenticationPlugin)
schema.plugin(friendsPlugin, { ref: 'User' })
schema.plugin(pollsPlugin)
schema.plugin(helpers)
schema.plugin(uniqueValidator)
schema.plugin(beautifyUnique)

function emailValidator (value) {
  if (!isEmail(value)) {
    this.invalidate('email', 'Not valid email address.')
  }
}

function usernameValidator (value) {
  const validUserName = /^[a-zA-Z0-9]+-*[a-zA-Z0-9]+$/

  if (!validUserName.test(value)) {
    this.invalidate('username', 'Username may only contain alphanumeric characters ' +
      'and one hyphens between them'
    )
  }
}

module.exports = mongoose.model('User', schema)
