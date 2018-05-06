const R = require('ramda')

const mergeIf = q2 => (cond, q1) => {
  if (cond) return R.merge(q1, q2)
  return q1
}

const query = {
  search (field, input) {
    const str = cleanString(input)

    if (!str) { return {} }

    return { [field]: new RegExp(str, 'i') }
  },

  unprotected: mergeIf({ protected: false }),

  unrestricted: mergeIf({ restricted: false })
}

function create (actions, view) {
  return (action) => {
    if (actions[action]) { return actions[action] }

    if (view[action]) {
      return (req, res) => {
        const page = view[action](res.locals)
        return res.render('application', page)
      }
    }

    return (req, res, next) => next()
  }
}

function createVoter (poll, option, session) {
  if (session.user) {
    return {
      poll,
      option,
      voter: session.user._id,
      type: 'User'
    }
  }

  return {
    poll,
    option,
    voter: session.id,
    type: 'Session'
  }
}

function cleanString (str) {
  const enabledChars = /^[a-zA-Z0-9_-]+/
  const disabledChars = /[^a-zA-Z0-9_-]+/g

  if (!str) { return '' }

  if (enabledChars.test(str)) {
    return str.trim().replace(/\s+/g, '-')
  }

  return str.trim().replace(disabledChars, '').replace(/\s+/g, '-')
}

function createSearchQuery (field, input) {
  const str = cleanString(input)

  if (!str) { return {} }

  return { [field]: new RegExp(str, 'i') }
}

module.exports = {
  create,
  createVoter,
  cleanString,
  createSearchQuery,
  query
}
