const { renderToStaticMarkup } = require('react-dom/server')
const h = require('react-hyperscript')
const { script, link } = require('hyperscript-helpers')(h)

function StyleSheetLink ({ href }) {
  return link({ href, rel: 'stylesheet' })
}

function JavascriptInclude (params) {
  const options = { src: params.src }
  if (params.defer !== undefined) { options.defer = '' }
  if (params.async !== undefined) { options.async = '' }

  return script(options)
}

function createAssetsList (env) {
  if (env === 'production') {
    const manifest = require('../../public/assets/manifest.json')
    const vendor = require('../../public/assets/vendor/manifest.json')
    const manifestList = Object.values(Object.assign(manifest, vendor))

    const js = manifestList.filter(x => /.jsx?$/.test(x))
    const css = manifestList.filter(x => /.css$/.test(x))

    const jsList = js.map(
      name => JavascriptInclude({ src: `/public/assets/${name}` })
    )

    const cssList = css.map(
      name => StyleSheetLink({ href: `/public/assets/$name` })
    )

    return jsList.concat(cssList).map(x => renderToStaticMarkup(x)).join('')
  }

  return renderToStaticMarkup(script({ src: '/public/assets/application.js' }))
}

module.exports = createAssetsList
