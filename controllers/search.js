const _ = require('lodash')
const Boom = require('boom')
const { search: searchClient } = require('../lib/elasticsearch/search')

const search = async (req, res) => {
  const {
    application_token: applicationToken,
    chat_number: chatNumber,
    text
  } = req.query

  if (_.isNil(applicationToken)) throw Boom.badRequest('application token is missing')
  if (_.isNil(chatNumber)) throw Boom.badRequest('chat number is missing')

  return searchClient(applicationToken, chatNumber, text)
}

module.exports = {
  search
}
