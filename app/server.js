const { join } = require('path')
const express = require('express')
// const compression = require('compression')
// const bodyParser = require('body-parser')
// const helmet = require('helmet')
// const validator = require('express-validator')

// const env = process.env.NODE_ENV || 'development'

const app = express()

app.set('view engine', 'hjs')
app.set('views', join(__dirname, 'views'))

app.use(express.static('public'))

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(validator())
// app.use(helmet())

// app.use(express.static(path.join(__dirname, 'build', 'public')))

// if (env === 'production') {
//   app.use(compression())
// }

app.get('/', (req, res) => {
  // res.render('index', { application: 'Hello!' })
  res.render('index')
})

module.exports = app
