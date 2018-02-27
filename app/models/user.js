const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const { isEmail, isLength } = require('validator')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const Schema = mongoose.Schema

const cost = 10

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: "Username can't be blank",
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
  },

  admin: {
    type: Boolean,
    default: false
  },

  activationDigest: {
    type: String
  },

  activated: {
    type: Boolean,
    default: false
  },

  activatedAt: {
    type: Date
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

userSchema.virtual('activationToken')
  .get(function () { return this._activationToken })
  .set(function (value) { this._activationToken = value })

userSchema.path('email').validate(emailValidator)
userSchema.pre('validate', passwordValidator)

userSchema.post('validate', createDigitalPassword)
userSchema.post('validate', createActivationDigest)

function emailValidator (value) {
  if (!isEmail(value)) {
    this.invalidate('email', 'Not valid email address')
  }
}

function passwordValidator (next) {
  const digestPresent = !this.isNew && this.passwordDigest
  const rawPasswordEmpty = !(this.password || this.passwordConfirmation)

  if (digestPresent && rawPasswordEmpty) {
    return next()
  }

  if (this.isNew && !this.password) {
    this.invalidate('password', "Password can't be blank")
  }

  if (!isLength(this.password, { min: 6 })) {
    this.invalidate('password', 'Password is too short (minimum is 6 characters)')
  }

  if (this.password !== this.passwordConfirmation) {
    this.invalidate('password', "Confirmation doesn't match password")
    this.invalidate('passwordConfirmation', "Confirmation doesn't match password")
  }

  return next()
}

function createDigitalPassword (user, next) {
  if (!user.password && !user.passwordConfirmation) { return next() }

  return digest(user.password, (err, hash) => {
    if (err) { return next(err) }
    user.passwordDigest = hash
    return next()
  })
}

function newToken (n, cb) {
  return crypto.randomBytes(n, (err, buf) => {
    if (err) return cb(err)
    const result = buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_')
    return cb(null, result)
  })
}

function digest (token, cb) {
  return bcrypt.hash(token, cost, cb)
}

function createActivationDigest (user, next) {
  if (!this.isNew) { return next() }

  return newToken(16, (err, token) => {
    if (err) { return next(err) }

    return digest(token, (err, hash) => {
      if (err) { return err }

      user.activationToken = token
      user.activationDigest = hash

      return next()
    })
  })
}

userSchema.statics.authenticateBy = function (attribute) {
  const digest = `${attribute}Digest`

  function authenticate (user, token, cb) {
    return bcrypt.compare(token, user[digest], (err, res) => {
      if (err) { return cb(err) }
      if (res) { return cb(null, user) }
      return cb(new Error('User or passord are wrong'))
    })
  }

  return (emailOrName, token, cb) => {
    const query = { $or: [{ email: emailOrName }, { username: emailOrName }] }

    return User.findOne(query)
      .exec((err, user) => {
        if (err) { return cb(err) }
        if (!user) { return cb(new Error('Authentification failed')) }
        return authenticate(user, token, cb)
      })
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User
