const h = require('hyperscript')
const { div } = require('hyperscript-helpers')(h)
const layout = require('../assets/javascript/layout')

function fullTitle (pageTitle = '') {
  const baseTitle = 'Vote Application'

  if (pageTitle.length === 0) { return baseTitle }

  return pageTitle + ' | ' + baseTitle
}

module.exports = function createLayout (env) {
  return params => {
    const page = layout(params.content)

    return {
      env,
      title: fullTitle(params.title),
      content: page.outerHTML
    }
  }
}
