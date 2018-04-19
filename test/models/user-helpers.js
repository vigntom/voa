import '../helpers/database'
import test from 'ava'
import User from '../../app/models/user'
import fixture from '../fixtures/users'

test.beforeEach(t => {
  t.context = {
    bob: fixture.bobProtectedEmail,
    sara: fixture.saraEnabledEmail
  }
})

test.after.always(() => {
  return User.remove()
})

test('should not select email with activated email protection', t => {
  const { bob } = t.context

  return User.findUser({ username: bob.username })
    .then(user => {
      t.truthy(user)
      t.falsy(user.email)
    })
})

test('should select email with not activated email protection', t => {
  const { sara } = t.context

  return User.findUser({ username: sara.username })
    .then(user => {
      t.truthy(user)
      t.is(user.email, sara.email)
    })
})
