const layout = require('../assets/javascript/layout')
const { renderToString } = require('react-dom/server')

function fullTitle (pageTitle = '') {
  const baseTitle = 'Vote Application'

  if (pageTitle.length === 0) {
    return baseTitle
  }

  return pageTitle + ' | ' + baseTitle
}

function fill ({ title, page, notice = {} }) {
  return {
    title: fullTitle(title),
    content: (session, paginate) => renderToString(
      layout({
        page,
        notice,
        session,
        paginate
      }))
  }
}

function createView ({ title, options, page }) {
  return {
    title: fullTitle(title),
    content: renderToString(layout({ options, page }))
  }
}

module.exports = { fullTitle, fill, createView }
