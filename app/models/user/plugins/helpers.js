function helpers (schema, options) {
  schema.statics.findUser = function (cond) {
    const model = this

    return model.findOne(cond).lean()
      .then(user => {
        if (user && user.emailProtected) {
          return model.findOne(cond, { email: 0 }).lean()
        }

        return user
      })
  }
}

module.exports = helpers
