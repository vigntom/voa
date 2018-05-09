const classnames = require('classnames')
const w = require('../helpers')
const h = require('../helpers/hyperscript')

const { div, input, button, span } = h

function Option ({ errors, isDeletable, value = {} }) {
  const options = w.maybeError({
    className: 'choice-name form-control',
    type: 'text',
    name: `name`,
    placeholder: 'Name',
    defaultValue: value.name
  }, errors, { path: 'name', placement: 'left' })

  return div({
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
        defaultValue: value.description
      })
    ]),

    button('.btn-del-choice.btn.btn-outline-danger', {
      type: 'button'
    }, [ span('.oi.voa-oi-sm.oi-x') ])
  ])
}

module.exports = Option
