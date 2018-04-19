function findByIdAndAddContributor (model, id, { contributor }) {
  return model.find({ contributors: id }).lean()
    .then(res => {
      if (res.length > 0) {
        return Promise.reject(new Error('Already contributor'))
      }

      return model.findByIdAndUpdate(
        id,
        { $push: { contributors: contributor } }
      )
    })
}

function movePolls (Poll, User, fromId, toId) {
  return Poll.updateMany({ author: fromId }, { $set: { author: toId } })
    .then(() => {
      return Poll.count({ author: toId })
    })
    .then(num => {
      return User.findByIdAndUpdate(toId, { $set: { polls: num } })
    })
}

function findVoter (model, { id, voter }) {
  return model.find({
    _id: id,
    'choices.votes': {
      $elemMatch: voter
    }
  })
}

function findByIdAndVote (model, id, { choice, voter }) {
  return model.findVoter({ id, voter }).lean()
    .then(res => {
      if (res.length > 0) {
        return Promise.reject(new Error('Already voted'))
      }

      return model.findOneAndUpdate(
        { _id: id, 'choices._id': choice },
        { $push: { 'choices.$.votes': voter } }
      )
    })
}

module.exports = {
  findByIdAndAddContributor,
  movePolls,
  findVoter,
  findByIdAndVote
}
