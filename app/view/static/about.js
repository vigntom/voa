const { fill } = require('../../helpers/application-helper')
const about = require('../../assets/javascript/about')

const title = 'About'

module.exports = () => fill(title, about())
