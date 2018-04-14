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
})

/* global $ */
