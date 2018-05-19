function checkValidation (e) {
  if (e.pattern) {
    const regex = new RegExp(e.pattern)
    return regex.test(e.value)
  }

  return e.value.length > 0
}

function confirmInputHandler (e) {
  const $block = $(e.target).closest('.confirmable')
  const $btn = $block.find('[data-disable-invalid]')
  const $required = $block.find('input[required]')
  const isVerified = $.makeArray($required).map(checkValidation).every(x => x === true)

  if (isVerified) {
    return $btn.prop('disabled', false)
  }

  return $btn.prop('disabled', true)
}

function enableConfirmableInputs () {
  $('#application').on('change keyup blur', 'input[required]', confirmInputHandler)
}

export default {
  enableConfirmableInputs
}

/* global $ */
