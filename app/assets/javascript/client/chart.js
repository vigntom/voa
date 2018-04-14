import { scaleSequential } from 'd3-scale'
import { interpolateRainbow } from 'd3-scale-chromatic'
import Chart from 'chart.js'

export default function () {
  let chart
  const $chart = $('#poll-chart')
  const d3 = { scaleSequential, interpolateRainbow }

  function createChart (poll) {
    const votes = poll.choices.reduce((acc, x) => acc + x.votes, 0)
    const data = poll.choices.map(x => Math.round(x.votes * 100 / votes))
    const maxVote = Math.max(...data)
    const toColor = d3.scaleSequential(
      d3.interpolateRainbow
    ).domain([0, maxVote])

    const chart = new Chart($chart, {
      type: 'horizontalBar',
      data: {
        labels: poll.choices.map(x => x.name),
        datasets: [{
          label: `Votes in % (total: ${votes})`,
          data,
          backgroundColor: data.map(toColor)
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
              return `${item.xLabel}% (votes: ${poll.choices[item.index].votes})`
            }
          }
        }
      }
    })

    return chart
  }

  function fetchChart () {
    const pollId = $('#vote-container').data('pollId')
    $.ajax({
      dataType: 'json',
      url: `/api/poll/${pollId}`
    }).done(poll => {
      chart = createChart(poll)
    })
  }

  function bindButton () {
    $('#voa-vote-btn').on('click', (e) => {
      const id = $('#vote-container').data('pollId')
      const choice = $('input[name=choice]:checked').val()

      if (!choice) { return choice }

      $.ajax({
        url: `/api/poll/${id}/${choice}`,
        dataType: 'json',
        method: 'patch'
      }).done(res => {
        if (res.result === 'ok') {
          chart.destroy()
          fetchChart()
          $('.vote-col').toggleClass('hide')
        }
      })
    })
  }

  if ($chart.length) {
    fetchChart()
    bindButton()
  }
}
/* global $ */
