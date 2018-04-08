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

module.exports = {
  create
}
