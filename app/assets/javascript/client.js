import rest from './client/rest'
import dinput from './client/dynamic-input.js'
import chart from './client/chart.js'

$(function () {
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  })

  $('[data-toggle="tooltip"]').tooltip()

  $('.alert-fadable').delay(3000).fadeTo(1000, 0.5, () => {
    $('.alert-fadable').alert('close')
  })

  rest()
  dinput()
  chart()
})

/* global $ */
