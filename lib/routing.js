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

module.exports = {
  create,
  voterQuery
}
