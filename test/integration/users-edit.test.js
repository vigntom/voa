import '../helpers/database'
import { createDoc, csrf, ua } from '../helpers/client'
import User from '../../app/models/user'
import app from '../../index'
import request from 'supertest'
import test from 'ava'

let activeUser

const login = {
  username: 'user-for-edit',
  email: 'user-for-edit@example.com',
  password: 'password',
  passwordConfirmation: 'password'
}

test.before(t => {
  return User.create(login)
    .then(user => {
      activeUser = user
    })
})

test.after.always(() => {
  return User.remove()
})

test('Unsuccessful edit', t => {
  const agent = request.agent(app)

  return agent.get('/')
    .then(ua.logInAsUser(agent, login))
    .then(ua.followRedirect(agent))
    .then(res => {
      return agent
        .patch(`/users/${activeUser.id}`)
        .send({
          _csrf: csrf(res.text),
          username: '',
          email: 'invalid@email'
        })
    })
    .then(res => {
      const doc = createDoc(res.text)
      t.is(doc.title, 'Edit User | Vote Application')
      t.truthy(doc.querySelector('.alert.alert-danger'))
    })
})

test('Successfull edit', t => {
  const agent = request.agent(app)
  return agent.get('/')
    .then(ua.logInAsUser(agent, login))
    .then(ua.followRedirect(agent))
    .then(res => agent
      .patch(`/users/${activeUser.id}`)
      .send({
        _csrf: csrf(res.text),
        username: 'edited-one',
        email: 'edited-Email@example.com',
        password: 'newSuperPassword',
        passwordConfirmation: 'newSuperPassword'
      }))
    .then(res => agent.get(res.header.location))
    .then(res => {
      const doc = createDoc(res.text)
      t.is(doc.title, 'Show Users | Vote Application')

      return User.findById(activeUser.id)
    })
    .then(user => {
      t.is(user.username, 'edited-one')
      t.is(user.email, 'edited-email@example.com')
      t.not(user.passwordDigest, activeUser.passwordDigest)
    })
})
