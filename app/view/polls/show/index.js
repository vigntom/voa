const classnames = require('classnames')
const h = require('../../helpers/hyperscript')
const w = require('../../helpers')
const NavBar = require('../nav-bar')
const VoteDesk = require('./vote-desk')

const { div, h1, p, a, span, input, button, canvas } = h

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

function NewOption ({ errors, isDeletable, value = {} }) {
  const options = w.maybeError({
    className: 'choice-name form-control',
    type: 'text',
    name: `name`,
    placeholder: 'Name',
    value: value.name,
    autoFocus: true,
    required: true,
    pattern: '\\S(.*\\S)?'
  }, errors, { path: 'name', placement: 'left' })

  return w.FormFor('#choice-free-form.confirmable', { action: '#' }, [
    div({
      className: classnames('choice form-row pb-1', { 'choice-core': !isDeletable })
    }, [
      div('.col-4', [
        input(options)
      ]),

      div('.col', [
        input('.choice-description.form-control', {
          type: 'text',
          name: 'description',
          placeholder: 'description (optional)',
          value: value.description
        })
      ]),

      button('.btn-del-choice.btn.btn-outline-danger', {
        type: 'button'
      }, [ span('.oi.voa-oi-sm.oi-x') ])
    ]),

    button('.choice-free-submit.btn.btn-outline-primary.btn-block',
      { type: 'submit', disabled: true, 'data-disable-invalid': true },
      'Create'
    )
  ])
}

function FreeChoiceModal () {
  return w.Modal({
    id: 'new-choice',
    title: 'Create new option'
  }, NewOption({ isDeletable: false }))
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
      ]),
      FreeChoiceModal()
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
