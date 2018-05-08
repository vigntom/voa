const layout = require('../app/view/application')

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
    content: (session, paginate) => layout({
      page,
      notice,
      session,
      paginate
    }).outerHTML
  }
}

function create ({ title, options, page }) {
  return {
    title: fullTitle(title),
    content: layout({ options, page }).outerHTML
  }
}

// function defaultView (title, template) {
//   return options => ({
//     title: fullTitle(title),
//     content: layout({
//       options,
//       page: template(options)
//     }).outerHTML
//   })
// }

function bind (template, data) {
  function title (data) {
    if (data && data.title) {
      return data.title
    }

    return 'Voting Application'
  }

  return Object.keys(template).reduce((acc, key) => {
    const obj = {
      [key]: options => create({
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
  // createView,
  //  defaultView,
  // initViews
  bind
}
