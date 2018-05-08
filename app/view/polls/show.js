const w = require('../helpers')
const h = require('../helpers/hyperscript')
const pollChart = require('../../../lib/poll-chart')
const Option = require('./option')
const R = require('ramda')

const { div, h1, h5, p, a, span, canvas, button, ul, li } = h

function ChoicesButton (options) {
  const { scale } = pollChart(
    R.map(x => ({ votes: x.votes.length }), options)
  )

  return index => {
    const item = options[index]

    return button('.btn.btn-choice.my-1', {
      type: 'button',
      'data-toggle': 'tooltip',
      'data-placement': 'right',
      title: item.description,
      key: index,
      value: item._id,
      style: { background: scale.color(item.votes.length) }
    }, div(item.name))
  }
}

function FreeChoice ({ isAuthenticated }) {
  if (!isAuthenticated) return null

  return div('.choices-free.d-flex.flex-column', [
    button('.btn.btn-choice-free.mt-3', {
      type: 'button',
      'data-toggle': 'modal',
      'data-target': '#new-choice'
    }, 'New option'),

    NewChoice()
  ])
}

function NewChoice () {
  return div('#new-choice.modal.fade', {
    tabIndex: '-1',
    role: 'dialog',
    'aria-labelledby': 'Create New Option',
    'aria-hidden': true
  }, [
    div('.modal-dialog.modal-dialog-centered', { role: 'document' }, [
      div('.modal-content', [
        div('.modal-header', [
          h5('.modal-title', 'Add your option'),

          button('.close', {
            type: 'button',
            'data-dismiss': 'modal',
            'aria-label': 'Close'
          }, [ span({ 'aria-hidden': true }, '×') ])
        ]),

        div('.modal-body', [
          Option({ isDeletable: false })
        ]),

        div('.modal-footer', [
          button('.choice-free-submit.btn.w-100',
            { type: 'submit' },
            'Create'
          )
        ])
      ])
    ])
  ])
}

function ChoicesGroup ({ options }) {
  const length = options.length
  const idx = R.range(0, length)

  return div('.choices-voted.d-flex.flex-column', [
    R.map(ChoicesButton(options), idx)
  ])
}

function VoteBar ({ poll, isAuthenticated }) {
  const { options } = poll
  return div('.d-flex.flex-column.px-2.py-4', [
    ChoicesGroup({ options }),
    FreeChoice({ isAuthenticated })
  ])
}

function Presentation ({ options }) {
  return div('.chart-container', [
    canvas('#poll-chart')
  ])
}

function VoteDesk ({ poll, isVoted, isAuthenticated }) {
  if (isVoted) return null

  return div('.vote-col.col-3.pl-3.pr-2', {
  }, [ VoteBar({ poll, isAuthenticated }) ])
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

function Show ({ poll, isVoted, isAuthenticated }) {
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

function PollTabNavBar (options) {
  const { poll, active } = options
  const author = poll.author.username
  const pollname = poll.name
  const tabState = active !== 'Settings' ? '.active' : '.text-muted'

  function Settings ({ canUpdate, poll, active }) {
    if (!canUpdate) return null
    const tabState = (active === 'Settings') ? '.active' : '.text-muted'

    return li('.nav-item', [
      a('.nav-link' + tabState, {
        href: w.path({ author, pollname, rest: 'settings' })
      }, [
        span('.oi.oi-cog.pr-1'),
        'Settings'
      ])
    ])
  }

  return ul('.nav.nav-tabs.container.border-0', [
    li('.nav-item',
      a('.nav-link' + tabState, {
        href: w.path({ author, pollname })
      }, [
        span('.oi.oi-bar-chart.pr-1'),
        'Poll'
      ])
    ),

    Settings(options)
  ])
}

module.exports = function Page ({ poll, flash, isVoted, isAuthenticated, canUpdate }) {
  return div('.bg-light.main', [
    div('.border-bottom', [
      div('.container.p-0', [
        w.MessageDesk(flash),
        Header({ poll }),
        PollTabNavBar({ poll, active: 'Poll', canUpdate })
      ])
    ]),

    Show({ poll, isVoted, isAuthenticated })
  ])
}
