import 'setup-env'
import Window from 'window'
import jQuery from 'jquery'

export default function (markup, doc) {
  const thisDoc = doc || window.document
  const container = thisDoc.createElement('div')

  container.innerHTML = markup

  return container.children.length > 1
    ? container.children
    : container.children[0]
}
