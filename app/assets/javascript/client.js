import rest from './client/rest'
import dinput from './client/dynamic-input.js'
import chart from './client/chart.js'
import voa from './client/voa'

$(function () {
  const $tooltip = $('[data-toggle=tooltip]')

  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  })

  rest()
  dinput()
  chart()
  voa.enableConfirmableInputs()
  $tooltip.tooltip()
  $tooltip.focus(() => $tooltip.tooltip('hide'))

  $('.alert-fadable').delay(3000).fadeTo(1000, 0.5, () => {
    $('.alert-fadable').alert('close')
  })

  $('.modal').on('shown.bs.modal', () => {
    $('[autofocus]').trigger('focus')
  })

  $('.modal').on('hidden.bs.modal', () => {
    $('.modal').find('input[type=text]').val('')
  })
})

/* global $ */
