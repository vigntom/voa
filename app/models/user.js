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
    type: String
  }
}, {
  timestamps: true
})

userSchema.plugin(uniqueValidator)

userSchema.virtual('password')
  .get(function () { return this._password })
  .set(function (value) { this._password = value })

userSchema.virtual('passwordConfirmation')
  .get(function () { return this._passwordConfirmation })
  .set(function (value) { this._passwordConfirmation = value })

userSchema.path('email').validate(emailValidator)

userSchema.pre('validate', passwordValidator)
userSchema.pre('save', createDigitalPassword)

function emailValidator (value) {
  if (!isEmail(value)) {
    this.invalidate('email', 'Not valid email address')
  }
}

function passwordValidator (next) {
  if (this.isNew && !this.password) {
    this.invalidate('password', "Password can't be blank")
  }

  if (!isLength(this.password, { min: 6 })) {
    this.invalidate('password', 'Password is too short (minimum is 6 characters)')
  }

  if (this.password !== this.passwordConfirmation) {
    this.invalidate('password', "Confirmation doesn't match password")
  }

  return next()
}

function createDigitalPassword (next) {
  const user = this

  function hashAsDigitalPassword (err, hash) {
    if (err) { return next(err) }
    user.passwordDigest = hash
    return next()
  }

  return bcrypt.hash(user.password, cost, hashAsDigitalPassword)
}

userSchema.statics.authenticate = function (identifier, password, cb) {
  const error = 'User or passord are wrong'

  function authenticateByEmail (email, password, cb) {
    return User.findOne({ email })
      .exec((err, user) => {
        if (err) { return cb(err) }
        if (!user) { return cb(new Error(error)) }
        return authenticate(password, user, cb)
      })
  }

  function authenticate (password, user, cb) {
    return bcrypt.compare(password, user.passwordDigest, (err, res) => {
      if (err) { return cb(err) }
      if (res) { return cb(null, user) }
      return cb(new Error(error))
    })
  }

  return User.findOne({ username: identifier })
    .exec((err, user) => {
      if (err) { return cb(err) }
      if (!user) { return authenticateByEmail(identifier, password, cb) }
      return authenticate(password, user, cb)
    })
}

const User = mongoose.model('User', userSchema)

module.exports = User
