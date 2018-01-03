const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')

const { div, h1, pre } = hh(h)

module.exports = function Index ({ users }) {
  return div('.main.container-fluid', [
    h1('users index'),
    pre(JSON.stringify(users, null, 4))
  ])
}
