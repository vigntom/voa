const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')
const { isEmail, isLength } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: "Name can't be blank",
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    unique: true,
    required: "Email can't be blank",
    trim: true,
    maxlength: 255,
    lowercase: true
  },
  passwordDigest: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

userSchema.virtual('password')
  .get(() => this._password)
  .set(createPasswordDigest)

userSchema.virtual('passwordConfirmation')
  .get(() => this._passwordConfirmation)
  .set(rememberPasswordConfirmation)

userSchema.path('email').validate(emailValidator)
userSchema.path('passwordDigest').validate(passwordDigestValidator)

function createPasswordDigest (value) {
  const salt = bcrypt.genSaltSync()

  this._password = value
  this.passwordDigest = bcrypt.hashSync(value, salt)
}

function rememberPasswordConfirmation (value) {
  this._passwordConfirmation = value
}

function passwordDigestValidator (value) {
  if (this.isNew && !this._password) {
    this.invalidate('password', "Password can't be blank")
  }

  if (!isLength(this._password, { min: 6 })) {
    this.invalidate('password', 'Password is too short (minimum is 6 characters)')
  }

  if (this._password !== this._passwordConfirmation) {
    this.invalidate('passwordConfirmation', "Confirmation doesn't match passwrod")
  }
}

function emailValidator (value) {
  if (!isEmail(value)) {
    this.invalidate('email', 'Not valid email address')
  }
}

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)
