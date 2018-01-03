const express = require('express')
const createAssetsList = require('./assets-list')

function createHandler (controller, action) {
  return (req, res) => {
    const { env, log } = req.app.locals.config
    const config = { env, assets: createAssetsList(env) }
    const params = Object.assign({}, req.body, { csrf: req.csrfToken() })

    // const view = page(params)

    // if (view) {
    //   const data = Object.assign({}, view, config)
    //   return res.render('application', data)
    // }

    // return res.redirect('/')
    // action(params, (err, ))
    controller[action](params, (err, data) => {
      if (err) {
        log.error(err)
        return res.redirect('/')
      }
    })
  }
}

function createMethod (router, method) {
  return (path, controller, action) =>
    router[method](path, createHandler(controller, action))
}

function createMethodsHelper (router) {
  return {
    get: createMethod(router, 'get'),
    post: createMethod(router, 'post'),
    put: createMethod(router, 'put'),
    patch: createMethod(router, 'patch'),
    delete: createMethod(router, 'delete')
  }
}

function createRouting (callback) {
  const router = express.Router()

  router.use((req, res, next) => {
    const log = req.app.locals.log
    log.debug(req.method, req.url)
    next()
  })

  const helpers = {
    resources (path, controller) {
      const current = express.Router()
      const r = createMethodsHelper(current)

      r.get('/', controller, 'index')
      r.get('/:id', controller, 'show')
      r.get('/new', controller, 'new')
      r.get('/:id/edit', controller, 'edit')
      r.post('/', controller, 'create')
      r.patch('/:id', controller, 'update')
      r.delete('/:id', controller, 'destroy')

      router.use(path, current)
    }
  }

  callback(Object.assign({}, createMethodsHelper(router), helpers))

  return router
}

module.exports = createRouting
