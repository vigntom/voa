const { script, link } = require('./hyperscript')

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

    return cssList.concat(jsList).map(x => x.outerHTML).join('')
  }

  return script({ src: '/public/assets/application.js', defer: true }).outerHTML
}

module.exports = createAssetsList
