import { JSDOM } from 'jsdom'

function createDoc (text) {
  const dom = new JSDOM(text)
  return dom.window.document
}

function csrf (text) {
  return createDoc(text)
    .querySelector('meta[name="csrf-token"]')
    .content
}

module.exports = {
  createDoc,
  csrf
}
