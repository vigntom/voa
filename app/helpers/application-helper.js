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

function defaultView (title, template) {
  return options => ({
    title: fullTitle(title),
    content: renderToString(layout({
      options,
      page: template(options)
    }))
  })
}

function initViews (template, data) {
  function title (data) {
    if (data && data.title) {
      return data.title
    }

    return 'Voting Application'
  }

  return Object.keys(template).reduce((acc, key) => {
    const obj = {
      [key]: options => createView({
        title: title(data[key]),
        options,
        page: template[key](options)
      })
    }

    return Object.assign({}, acc, obj)
  }, {})
}

module.exports = {
  fullTitle,
  fill,
  createView,
  defaultView,
  initViews
}
