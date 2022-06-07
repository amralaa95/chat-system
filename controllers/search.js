const _ = require('lodash')
const Boom = require('boom')
const { wrapAsyncAction } = require('../lib/express_async')
const { searchDocuments } = require('../lib/elasticsearch')

const search = async (req, res) => {
  const {
    application_token: applicationToken,
    chat_number: chatNumber,
    body
  } = req.query

  if (_.isNil(applicationToken)) throw Boom.badRequest('application token is missing')
  if (_.isNil(chatNumber)) throw Boom.badRequest('chat number is missing')

  return searchDocuments({application_token: applicationToken, chat_number: chatNumber}, body)
}

module.exports = {
  search: wrapAsyncAction(search)
}
