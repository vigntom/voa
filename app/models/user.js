const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')
const { isEmail, isLength } = require('validator')
const bcrypt = require('bcrypt')

const cost = 10

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
  .get(function () { return this._password })
  .set(function (value) { this._password = value })

userSchema.virtual('passwordConfirmation')
  .get(function () { return this._passwordConfirmation })
  .set(function (value) { this._passwordConfirmation = value })

userSchema.pre('validate', function (next) {
  const user = this

  bcrypt.hash(user.password, cost, function (err, hash) {
    if (err) { return next(err) }

    user.passwordDigest = hash
    next()
  })
})

userSchema.pre('update', function (next) {
  this.options.runValidators = true
  next()
})

userSchema.path('email').validate(emailValidator)
userSchema.path('passwordDigest').validate(passwordDigestValidator)

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
