const h = require('hyperscript')
const { html, meta, head, title, body, div } = require('hyperscript-helpers')(h)

function fullTitle (pageTitle = '') {
  const baseTitle = 'Vote Application'

  if (pageTitle.length === 0) { return baseTitle }

  return pageTitle + ' | ' + baseTitle
}

module.exports = function createLayout (params) {
  const doctypeString = '<!DOCTYPE html>'
  const page = html({ lang: 'en' },
    head(
      meta({ charset: 'utf-8' }),
      title(fullTitle(params.title))
    ),
    body(
      div('.app-root', params.content)
    )
  ).outerHTML

  return doctypeString + '\n' + page
}
