const SignUp = require('../users/signup')
const { MessageDesk } = require('../helpers')
const { div, h1, h5, h6, p, a, table, thead, tbody, tr, th, td } = require('../helpers/hyperscript')

module.exports = function Home (params) {
  return div('.jumbotron.jumbotron-fluid.bg-dark-lighter.text-light', [
    MessageDesk(params.flash),
    div('.container-fluid.my-5', [
      div('.main.row', [
        div('.col-lg-7', [
          h1('.text-center.mb-5', 'Welcome to the Votting Application'),
          div('.card.m-3.bg-light.text-dark.stack-level-2', [
            div('.card-body', [
              h5('.card-title', 'Want to discover something fun?'),
              p('.card-text', 'To find vottings just follow the link bellow or use search bar'),
              a('.card-link', { href: '/search' }, 'Find vottings')
            ])
          ]),

          div('.card.m-3.bg-light.text-dark.stack-level-2', [
            div('.card-body', [
              h5('.card-title.mb-3', 'VoA demo application'),
              h6('.card-title', 'To login use one of the test accounts bellow:'),
              div('.card-text', [
                table('.table.w-50', [
                  thead([
                    tr([
                      th({ scope: 'col' }, 'Username'),
                      th({ scope: 'col' }, 'Password'),
                      th({ scope: 'col' }, 'Role')
                    ])
                  ]),

                  tbody([
                    tr([
                      td('Admin'),
                      td('123qwe'),
                      td('admin')
                    ]),

                    tr([
                      td('foo'),
                      td('123qwe'),
                      td('user')
                    ]),

                    tr([
                      td('bar'),
                      td('123qwe'),
                      td('user')
                    ])
                  ])
                ])
              ]),
              p('.card-text.mt-3', 'Or register a new user.')
            ])
          ])
        ]),
        div('.col-lg.mx-4', [
          div('.bg-light.text-dark.rounded.px-3.py-3', [ SignUp(params) ])
        ])
      ])
    ])
  ])
}
