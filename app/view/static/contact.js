const { fill } = require('../../helpers/application-helper')
const contact = require('../../assets/javascript/contact')

const title = 'Contact'

module.exports = () => fill(title, contact())
