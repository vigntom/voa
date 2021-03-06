import Chart from 'chart.js'
import pollChart from '../../../../lib/poll-chart'

export default function () {
  let chart
  const $chart = $('#poll-chart')

  function createChart (poll) {
    const { data, votes, scale } = pollChart(poll.options)

    const chart = new Chart($chart, {
      type: 'horizontalBar',
      data: {
        labels: poll.options.map(x => x.name),
        datasets: [{
          label: `Votes in % (total: ${votes})`,
          data: data.map(scale.vote),
          backgroundColor: data.map(scale.color)
        }]
      },
      options: {
        scales: {
          xAxes: [{
            gridLines: { display: false },
            ticks: {
              suggestedMin: 0,
              suggestedMax: 100
            }
          }],
          yAxes: [{
            gridLines: { display: false }
          }]
        },
        tooltips: {
          callbacks: {
            label (item, data) {
              return `${item.xLabel}% (votes: ${poll.options[item.index].votes})`
            }
          }
        }
      }
    })

    return chart
  }

  function fetchChart () {
    const pollId = $('#vote-container').data('pollId')
    return $.ajax({
      dataType: 'json',
      url: `/api/poll/${pollId}`
    }).done(poll => {
      chart = createChart(poll)
    })
  }

  function updateVoteDesk (content) {
    $('.vote-col').replaceWith($(content))
    bindVoteButton()
  }

  function bindVoteButton () {
    $('.choices-voted').on('click', e => {
      const $btn = $(e.target).closest('button')
      const option = $btn.val()
      const poll = $('#vote-container').data('pollId')

      $btn.tooltip('hide')

      return $.ajax({
        url: `/api/vote/${poll}/${option}`,
        dataType: 'json',
        method: 'post'
      }).done(res => {
        if (res.success) {
          chart.destroy()
          fetchChart()
          $('.vote-col').remove()
        }
      })
    })
  }

  function bindFreeVoteButton () {
    $('#choice-free-form').on('submit', e => {
      const poll = $('#vote-container').data('pollId')
      const name = $('.choice-name').val()
      const description = $('.choice-description').val()

      e.preventDefault()

      $.ajax({
        dataType: 'json',
        url: '/api/option',
        data: { poll, name, description, freeChoice: true },
        method: 'post'
      }).done(res => {
        const errors = res.errors

        if (res.success) {
          chart.destroy()
          fetchChart()
          updateVoteDesk(res.content)

          $('.modal').modal('hide')
        }

        if (errors) {
          const $el = $('[name=name]')

          if (errors.name) {
            const msg = errors.name.kind === 'unique'
              ? 'Name must be unique'
              : errors.name.message
            $el.data('toggle', 'tooltip')
            $el.addClass('is-invalid')
            $el.tooltip('dispose')
            $el.tooltip({ title: msg })
          }

          return null
        }
      })
    })
  }

  if ($chart.length) {
    fetchChart()
    bindVoteButton()
    bindFreeVoteButton()
  }
}

/* global $ */
