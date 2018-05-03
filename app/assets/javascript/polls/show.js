const h = require('react-hyperscript')
const hh = require('hyperscript-helpers')
const w = require('../../../helpers/view-helper')
const pollChart = require('../../../../lib/poll-chart')
const ChoiceItem = require('./_choice-item')
const R = require('ramda')

const { div, h1, h5, p, a, span, canvas, button, ul, li } = hh(h)

function ChoicesButton (choices) {
  const { scale } = pollChart(
    R.map(x => ({ votes: x.votes.length }), choices)
  )

  return index => {
    const item = choices[index]

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
          ChoiceItem({ isDeletable: false })
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

function ChoicesGroup ({ choices }) {
  const length = choices.length
  const idx = R.range(0, length)

  return div('.choices-voted.d-flex.flex-column', [
    R.map(ChoicesButton(choices), idx)
  ])
}

function VoteBar ({ poll, isAuthenticated }) {
  const { choices } = poll
  return div('.d-flex.flex-column.px-2.py-4', [
    ChoicesGroup({ choices }),
    FreeChoice({ isAuthenticated })
  ])
}

function Presentation ({ choices }) {
  return div('.chart-container', [
    canvas('#poll-chart')
  ])
}

function VoteDesk ({ poll, isVoted, isAuthenticated }) {
  if (isVoted) return null

  return div('.vote-col.col-3.pl-3.pr-2', {
  }, [ VoteBar({ poll, isAuthenticated }) ])
}

function Header ({ _id, name, author }) {
  return div('.py-3', [
    h1('.h3', [
      a({ href: `/users/${author._id}` }, author.username),
      span('.slash', ' / '),
      a({ href: `/polls/${_id}` }, name)
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

  function Settings ({ canUpdate, poll, active }) {
    if (!canUpdate) return null

    return li('.nav-item', [
      a('.nav-link', {
        href: `/polls/${poll._id}/settings`,
        className: (active === 'Settings') ? 'active' : 'text-muted'
      }, [
        span('.oi.oi-cog.pr-1'),
        'Settings'
      ])
    ])
  }

  return ul('.nav.nav-tabs.container.border-0', [
    li('.nav-item', [
      a('.nav-link', {
        href: `/polls/${poll._id}`,
        className: (active !== 'Settings') ? 'active' : 'text-muted'
      }, [
        span('.oi.oi-bar-chart.pr-1'),
        'Poll'
      ])
    ]),

    Settings(options)
  ])
}

module.exports = function Page ({ poll, flash, isVoted, isAuthenticated, canUpdate }) {
  return div('.bg-light.main', [
    div('.border-bottom', [
      div('.container.p-0', [
        w.MessageDesk(flash),
        Header(poll),
        PollTabNavBar({ poll, active: 'Poll', canUpdate })
      ])
    ]),

    Show({ poll, isVoted, isAuthenticated })
  ])
}
