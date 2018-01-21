const layout = require('../assets/javascript/layout')
const { renderToString } = require('react-dom/server')

function fullTitle (pageTitle = '') {
  const baseTitle = 'Vote Application'

  if (pageTitle.length === 0) {
    return baseTitle
  }

  return pageTitle + ' | ' + baseTitle
}

function fill ({ title, page }) {
  return {
    title: fullTitle(title),
    content: messages => renderToString(layout({ page, messages }))
  }
}

module.exports = { fullTitle, fill }
