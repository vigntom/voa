const digest = require('../lib/digest')
const { isLength } = require('validator')

function passwordValidator (next) {
  const digestPresent = !this.isNew && this.passwordDigest
  const rawPasswordEmpty = !(this.password || this.passwordConfirmation)

  if (digestPresent && rawPasswordEmpty) {
    return next()
  }

  if (this.isNew && !this.password) {
    this.invalidate('password', "Password can't be blank")
  }

  // * for service account without access rights
  // this accounts for deleted users
  if (this.password === '*' && this.passwordConfirmation === '*') {
    return next()
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

  if (user.password === '*') {
    user.passwordDigest = '*'
    return next()
  }

  return digest.digest(user.password, (err, hash) => {
    if (err) { return next(err) }
    user.passwordDigest = hash
    return next()
  })
}

function createResetDigest (user, cb) {
  return digest.newToken(16, (err, token) => {
    if (err) { return cb(err) }

    return digest.digest(token, (err, hash) => {
      if (err) { return cb(err) }

      user.resetToken = token
      user.resetDigest = hash
      user.resetCreatedAt = Date.now()

      return user.save((err, result) => {
        if (err) { return cb(err) }
        return cb(null, user)
      })
    })
  })
}

function createActivationDigest (user, next) {
  if (!this.isNew) { return next() }

  return digest.newToken(16, (err, token) => {
    if (err) { return next(err) }

    return digest.digest(token, (err, hash) => {
      if (err) { return next(err) }

      user.activationToken = token
      user.activationDigest = hash

      return next()
    })
  })
}

function authenticateBy (attribute) {
  const digestAttr = `${attribute}Digest`

  return (emailOrName, token, cb) => {
    const query = { $or: [{ email: emailOrName }, { username: emailOrName }] }

    return this.findOne(query)
      .exec((err, user) => {
        if (err) { return cb(err) }
        if (!user) { return cb(null, user) } // cb(new Error('Authentification failed')) }

        return digest.authenticate(token, user[digestAttr], (err, res) => {
          if (err) { return cb(err) }
          if (res) { return cb(null, user) }
          return cb(null, false)
        })
      })
  }
}

function passwordAuthentication (schema, options) {
  schema.add({
    passwordDigest: { type: String },
    resetDigest: { type: String },
    resetCreatedAt: { type: Date },
    activationDigest: { type: String },
    activated: { type: Boolean, default: false },
    activatedAt: { type: Date }
  })

  schema.virtual('password')
    .get(function () { return this._password })
    .set(function (value) { this._password = value })

  schema.virtual('passwordConfirmation')
    .get(function () { return this._passwordConfirmation })
    .set(function (value) { this._passwordConfirmation = value })

  schema.virtual('resetToken')
    .get(function () { return this._resetToken })
    .set(function (value) { this._resetToken = value })

  schema.virtual('activationToken')
    .get(function () { return this._activationToken })
    .set(function (value) { this._activationToken = value })

  schema.pre('validate', passwordValidator)
  schema.post('validate', createDigitalPassword)
  schema.post('validate', createActivationDigest)

  schema.statics.createResetDigest = createResetDigest
  schema.statics.authenticateBy = authenticateBy
}

module.exports = passwordAuthentication
