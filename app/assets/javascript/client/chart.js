const Chart = require('chart.js')
const scale = require('d3-scale')
const chromatic = require('d3-scale-chromatic')

const $chart = $('#poll-chart')

function createChart () {
  const pollId = $('#vote-container').data('pollId')

  $.ajax({
    dataType: 'json',
    url: `/api/poll/${pollId}`
  }).done(poll => {
    const votes = poll.choices.reduce((acc, x) => acc + x.votes, 0)
    const data = poll.choices.map(x => Math.round(x.votes * 100 / votes))
    const maxVote = Math.max(...data)
    const toColor = scale
      .scaleSequential(chromatic.interpolateRainbow)
      .domain([0, maxVote])

    const chart = new Chart($chart, {
      type: 'horizontalBar',
      data: {
        labels: poll.choices.map(x => x.name),
        datasets: [{
          label: '% of all votes',
          data,
          backgroundColor: data.map(toColor),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRation: false,
        scales: {
          xAxes: [{
            ticks: {
              suggestedMin: 0,
              suggestedMax: 100
            }
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
  })
}

if ($chart.length) { createChart() }

/* global $ */
