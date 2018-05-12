const classnames = require('classnames')
const h = require('../helpers/hyperscript')
const w = require('../helpers')

const { div, input, button, span } = h

function ChoiceItem (options) {
  const { item, errors, isDeletable } = options

  const nameOptions = {
    type: 'text',
    name: `options[update][${item._id}][name]`,
    placeholder: 'Choice name',
    value: item.name
  }

  return div({
    'data-options-id': item._id,
    className: classnames('choice form-row pb-1', { 'choice-core': !isDeletable })
  }, [
    div('.col-4', [
      input('.choice-name.form-control',
        w.maybeError(nameOptions, errors, {
          path: 'name',
          placement: 'left'
        })
      )
    ]),

    div('.col', [
      input('.choice-description.form-control', {
        type: 'text',
        name: `options[update][${item._id}][description]`,
        placeholder: 'description (optional)',
        value: item.description
      })
    ]),

    button('.btn-del-choice.btn.btn-outline-danger', {
      type: 'button'
    }, [ span('.oi.voa-oi-sm.oi-x') ])
  ])
}

module.exports = ChoiceItem
