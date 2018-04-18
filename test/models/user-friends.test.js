import '../helpers/database'
import test from 'ava'
import User from '../../app/models/user'
import fixture from '../fixtures/users'

test.beforeEach(t => {
  t.context = {
    bob: fixture.bob.username,
    sara: fixture.sara.username,
    den: fixture.den.username,
    samanta: fixture.samanta.username
  }
})

test.after.always(() => {
  return User.remove()
})

test('friendship from request', t => {
  const { bob, sara } = t.context

  const request = () => User.findOne({ username: bob })
    .requestFriendship({ username: sara })
    .then(() => Promise.all([
      User.findOne({ username: bob }),
      User.findOne({ username: sara })
    ]))
    .then(([from, to]) => {
      t.is(from.pending.length, 0)
      t.is(from.friends.length, 0)
      t.is(from.requests.length, 1)
      t.deepEqual(from.requests[0].user, to._id)

      t.is(to.requests.length, 0)
      t.is(to.friends.length, 0)
      t.is(to.pending.length, 1)
      t.deepEqual(to.pending[0].user, from._id)
    })

  const reverseRequest = () => User.findOne({ username: sara })
    .requestFriendship({ username: bob })
    .catch(err => {
      t.truthy(err.errors)
    })
    .then(() => Promise.all([
      User.findOne({ username: sara }),
      User.findOne({ username: bob })
    ]))
    .then(([from, to]) => {
      t.is(from.requests.length, 0)
      t.is(to.pending.length, 0)
    })

  const accept = () => User.findOne({ username: sara })
    .acceptFriendship({ username: bob })
    .then(() => Promise.all([
      User.findOne({ username: bob }),
      User.findOne({ username: sara })
    ]))
    .then(([u1, u2]) => {
      t.is(u1.pending.length, 0)
      t.is(u1.requests.length, 0)
      t.is(u1.friends.length, 1)
      t.deepEqual(u1.friends[0].user, u2._id)

      t.is(u2.pending.length, 0)
      t.is(u2.requests.length, 0)
      t.is(u2.friends.length, 1)
      t.deepEqual(u2.friends[0].user, u1._id)
    })

  return request()
    .then(reverseRequest)
    .then(accept)
})

test('should create friendship connection and drop after', t => {
  const { den, samanta } = t.context

  const addFriend = () => User.findOne({ username: den })
    .addFriend({ username: samanta })
    .then(() => Promise.all([
      User.findOne({ username: den }),
      User.findOne({ username: samanta })
    ]))
    .then(([u1, u2]) => {
      t.is(u1.friends.length, 1)
      t.deepEqual(u1.friends[0].user, u2._id)

      t.is(u2.friends.length, 1)
      t.deepEqual(u2.friends[0].user, u1._id)
    })

  const dropFriend = () => User.findOne({ username: samanta })
    .dropFriend({ username: den })
    .then(() => Promise.all([
      User.findOne({ username: den }),
      User.findOne({ username: samanta })
    ]))
    .then(([u1, u2]) => {
      t.is(u1.friends.length, 0)
      t.is(u2.friends.length, 0)
    })

  return addFriend().then(dropFriend)
})
