const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

function friendsPlugin (schema, options) {
  const userSinceSchema = {
    _id: false,
    user: { type: ObjectId, ref: options.ref },
    since: { type: Date, default: Date.now }
  }

  schema.add({
    friends: [ userSinceSchema ],
    pending: [ userSinceSchema ],
    requests: [ userSinceSchema ]
  })

  schema.query.addFriend = function (cond) {
    const query = this

    return Promise.all([
      query,
      query.model.findOne(cond)
    ]).then(([u1, u2]) => {
      return Promise.all([
        u1.update({ $push: { friends: { user: u2._id } } }),
        u2.update({ $push: { friends: { user: u1._id } } })
      ])
    })
  }

  schema.query.dropFriend = function (cond) {
    const query = this

    return Promise.all([
      query,
      query.model.findOne(cond)
    ]).then(([u1, u2]) => {
      return Promise.all([
        u1.update({ $pull: { friends: { user: u2._id } } }),
        u2.update({ $pull: { friends: { user: u1._id } } })
      ])
    })
  }

  schema.query.requestFriendship = function (cond) {
    const query = this

    return Promise.all([
      query,
      query.model.findOne(cond)
    ]).then(([from, to]) => {
      return Promise.all([
        from.update({ $push: { requests: { user: to._id } } }),
        to.update({ $push: { pending: { user: from._id } } })
      ])
    })
  }

  schema.query.acceptFriendship = function (cond) {
    const query = this

    return Promise.all([
      query,
      query.model.findOne(cond)
    ]).then(([to, from]) => {
      if (!from) return from

      return Promise.all([
        to.update({ $pull: { pending: { user: from._id } } }),
        from.update({ $pull: { requests: { user: to._id } } }),
        query.addFriend(cond)
      ])
    })
  }

  schema.pre('update', function () {
    const query = this
    const update = query.getUpdate()

    function findPlaceAndUser (obj) {
      if (obj.friends) return { place: 'friends', user: obj.friends.user }
      if (obj.pending) return { place: 'pending', user: obj.pending.user }
      if (obj.requests) return { place: 'requests', user: obj.requests.user }

      return null
    }

    if (update.$push) {
      const cond = query.getQuery()
      const params = findPlaceAndUser(update.$push)

      if (!params) return params

      const q = () => query.model.findOne(cond)

      return Promise.all([
        q().where('friends').elemMatch({ user: params.user }),
        q().where('pending').elemMatch({ user: params.user }),
        q().where('requests').elemMatch({ user: params.user })
      ]).then(([friends, pending, requests]) => {
        const invalidate = (path, message) => {
          const { ValidationError, ValidatorError } = mongoose.Error
          const err = new ValidationError()

          err.errors[path] = new ValidatorError({
            path,
            message,
            type: 'notvalid',
            value: null
          })

          query.error(err)
        }

        if (friends) return invalidate('friends', 'Already friends')
        if (pending) return invalidate('pending', 'Already in pending')
        if (requests) return invalidate('requests', 'Request already sent')
      })
    }
  })
}

module.exports = friendsPlugin
