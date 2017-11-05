const h = require('react-hyperscript')
const { h1 } = require('hyperscript-helpers')(h)

module.exports = {
  title: 'About',
  content: { page: () => h1('About Page') }
}
