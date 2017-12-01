require('./setup-env')
const browserEnv = require('browser-env')
const jQuery = require('jquery')

browserEnv()
global.$ = jQuery(window)
