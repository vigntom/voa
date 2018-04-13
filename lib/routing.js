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

function voterQuery (session) {
  if (session.user) {
    return {
      voter: session.user._id,
      type: 'User'
    }
  }

  return {
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

  return { [field]: new RegExp(str) }
}

module.exports = {
  create,
  voterQuery,
  cleanString,
  createSearchQuery
}
