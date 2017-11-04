const h = require('hyperscript')
const path = require('path')
const { script, link } = require('hyperscript-helpers')(h)
const layout = require('../assets/javascript/layout')

function fullTitle (pageTitle = '') {
  const baseTitle = 'Vote Application'

  if (pageTitle.length === 0) { return baseTitle }

  return pageTitle + ' | ' + baseTitle
}

function createAssetsList (env) {
  if (env === 'production') {
    const manifest = require('../../public/assets/manifest.json')
    const vendor = require('../../public/assets/vendor/manifest.json')
    const manifestList = Object.values(Object.assign(manifest, vendor))

    const js = manifestList.filter(x => /.jsx?$/.test(x))
    const css = manifestList.filter(x => /.css$/.test(x))
    const jsList = js.map(name => script({ src: `/public/assets/${name}` }))
    const cssList = css.map(name =>
      link({
        href: `/public/assets/${name}`,
        rel: 'stylesheet' }
      )
    )

    return jsList.concat(cssList).map(x => x.outerHTML).join('')
  }

  return script({ src: '/public/assets/application.js' }).outerHTML
}

module.exports = function createLayout (env) {
  return params => {
    const page = layout(params.content)

    return {
      env,
      title: fullTitle(params.title),
      assets: createAssetsList(env),
      content: page.outerHTML
    }
  }
}
