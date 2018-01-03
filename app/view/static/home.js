const { fill } = require('../../helpers/application-helper')
const home = require('../../assets/javascript/home')

const title = 'Home'

module.exports = (params) => fill(title, home(params))
