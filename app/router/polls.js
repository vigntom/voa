const express = require('express')
const { createView } = require('../helpers/application-helper')
const routing = require('../../lib/routing')
const template = require('../assets/javascript/polls')

const data = {
  index: { title: 'Polls' },
  show: { title: 'Show polls' },
  new: { title: 'New poll' },
  edit: { title: 'Edit poll' }
}

function createViews (template, data) {
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

const view = createViews(template, data)

const actions = {}

function createRouter () {
  const to = routing.create(actions, view)
  const router = express.Router()

  router.get('/', to('index'))
  router.get('/new', to('new'))
  router.get('/:id', to('show'))
  router.get('/:id/edit', to('edit'))

  router.post('/', to('create'))
  router.patch('/:id', to('update'))
  router.delete('/:id', to('delete'))

  return { to, router }
}

module.exports = createRouter()
