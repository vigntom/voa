import { JSDOM } from 'jsdom'

function createDoc (text) {
  const dom = new JSDOM(text)
  return dom.window.document
}

function csrf (text) {
  return createDoc(text)
    .querySelector('meta[name="csrf-token"]')
    .content
}

function logInAsUser (agent, user = {}) {
  return res => agent
    .post('/login')
    .send({
      _csrf: csrf(res.text),
      user: user.username,
      password: user.password,
      rememberMe: user.rememberMe
    })
}

function signUpAsUser (agent, user = {}) {
  return res => agent
    .post('/users').send({
      _csrf: csrf(res.text),
      username: user.username,
      email: user.email,
      password: user.password,
      passwordConfirmation: user.passwordConfirmation
    })
}

function followRedirect (agent) {
  return res => agent.get(res.headers.location)
}

module.exports = {
  createDoc,
  csrf,
  ua: {
    logInAsUser,
    signUpAsUser,
    followRedirect
  }
}
