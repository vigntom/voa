function create (actions, view) {
  return function goto (action) {
    if (actions[action]) { return actions[action] }

    if (view[action]) {
      return (req, res) => {
        const page = view[action](req.csrfToken())
        return res.render('application', page)
      }
    }

    return (req, res, next) => next()
  }
}

module.exports = {
  create
}
