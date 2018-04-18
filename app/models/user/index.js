const mongoose = require('mongoose')
const { isEmail } = require('validator')
const uniqueValidator = require('mongoose-unique-validator')
const authenticationPlugin = require('./plugins/authentication')
const pollsPlugin = require('./plugins/polls')
const friendsPlugin = require('./plugins/friends')

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: "Username can't be blank",
    trim: true,
    minlength: [ 1, 'Username is too short. Use at least 1 characters.' ],
    maxlength: [ 32, 'Username is too long. Limit it to 32 characters.' ]
  },

  email: {
    type: String,
    unique: true,
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

userSchema.plugin(uniqueValidator)
userSchema.plugin(authenticationPlugin)
userSchema.plugin(friendsPlugin, { ref: 'User' })
userSchema.plugin(pollsPlugin)

userSchema.path('email').validate(emailValidator)
userSchema.path('username').validate(usernameValidator)

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

module.exports = mongoose.model('User', userSchema)
