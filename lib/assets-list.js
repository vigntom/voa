const { renderToStaticMarkup } = require('react-dom/server')
const h = require('react-hyperscript')
const { script, link } = require('hyperscript-helpers')(h)

function StyleSheetLink ({ href }) {
  return link({ href, rel: 'stylesheet' })
}

function createAssetsList (env) {
  if (env === 'production') {
    const manifest = require('../public/assets/manifest.json')
    const manifestList = Object.values(manifest)

    const js = manifestList.filter(x => /.jsx?$/.test(x))
    const css = manifestList.filter(x => /.css$/.test(x))

    const jsList = js.map(
      name => script({ src: `/public/assets/${name}`, defer: true })
    )

    const cssList = css.map(
      name => StyleSheetLink({ href: `/public/assets/${name}` })
    )

    return cssList.concat(jsList).map(x => renderToStaticMarkup(x)).join('')
  }

  return renderToStaticMarkup(
    script({ src: '/public/assets/application.js', defer: true })
  )
}

module.exports = createAssetsList
