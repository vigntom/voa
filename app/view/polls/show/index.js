const h = require('../../helpers/hyperscript')
const w = require('../../helpers')
const NavBar = require('../nav-bar')
const VoteDesk = require('./vote-desk')

const { div, h1, p, a, span, canvas } = h

function Presentation ({ options }) {
  return div('.chart-container', [
    canvas('#poll-chart')
  ])
}

function Header ({ poll }) {
  const author = poll.author.username
  const pollname = poll.name

  return div('.py-3', [
    h1('.h3', [
      a({ href: w.path({ author }) }, author),
      span('.slash', ' / '),
      a({ href: w.path({ author, pollname }) }, pollname)
    ])
  ])
}

function ShowPoll ({ poll, isVoted, isAuthenticated }) {
  return div('.bg-white', [
    div('.container', [
      div('.row', [
        p('.h5.font-weight-normal.pt-3.pb-4', poll.description)
      ]),
      div('#vote-container.row.border.rounded.mb-5', {
        'data-poll-id': poll._id
      }, [
        VoteDesk({ poll, isVoted, isAuthenticated }),
        div('.chart-col.col-8.pl-2.pr-3.m-auto', [ Presentation(poll) ])
      ])
    ])
  ])
}

module.exports = function Page (options) {
  const { poll, canUpdate, flash } = options

  return div('.bg-light.main', [
    div('.border-bottom', [
      div('.container.p-0', [
        w.MessageDesk(flash),
        Header({ poll }),
        NavBar({ poll, active: 'Poll', canUpdate })
      ])
    ]),

    ShowPoll(options)
  ])
}
