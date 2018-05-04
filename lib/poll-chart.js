const { scaleLinear, scaleSequential } = require('d3-scale')
const { interpolateRainbow } = require('d3-scale-chromatic')
const d3 = { scaleSequential, scaleLinear, interpolateRainbow }
const R = require('ramda')

function pollData (options) {
  const data = R.map(x => x.votes, options)
  const votes = R.reduce((acc, x) => x + acc, 0, data)
  const maxVote = Math.max(...data)

  const scale = {
    vote: d3.scaleLinear().domain([0, votes]).rangeRound([0, 100]),
    color: d3.scaleSequential(d3.interpolateRainbow).domain([0, maxVote + 1])
  }

  return {
    data,
    votes,
    scale
  }
}

module.exports = pollData
