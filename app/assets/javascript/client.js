import rest from './client/rest'
import dinput from './client/dynamic-input.js'
import chart from './client/chart.js'

$(function () {
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  })

  rest()
  dinput()
  chart()

  $('.alert-fadable').delay(3000).fadeTo(1000, 0.5, () => {
    $('.alert-fadable').alert('close')
  })

  const $tooltip = $('[data-toggle=tooltip]')

  $tooltip.tooltip()
  $tooltip.focus(() => $tooltip.tooltip('hide'))

  $('.modal').on('shown.bs.modal', () => {
    $('[autofocus]').trigger('focus')
  })

  function checkValidation (e) {
    if (e.pattern) {
      const regex = new RegExp(e.pattern)
      return regex.test(e.value)
    }

    return e.value.length > 0
  }

  $('.confirmable').on('change keyup blur', 'input[required]', e => {
    const $form = $(e.target).closest('form')
    const $btn = $form.find('[data-disable-invalid]')
    const $required = $form.find('input[required]')
    const isVerified = $.makeArray($required).map(checkValidation).every(x => x === true)

    if (isVerified) {
      return $btn.prop('disabled', false)
    }

    return $btn.prop('disabled', true)
  })
})

/* global $ */
