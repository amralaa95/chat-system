const _ = require('lodash')
const Boom = require('boom')
const { wrapAsyncAction } = require('../lib/express_async')
const models = require('../models')
const logger = require('../lib/logger')
const { getLastNumber } = require('../lib/utils')
const { Producer } = require('../config/kafka_producer')

const createChat = async (req, res) => {
  const { application_token: applicationToken } = req.params

  if (_.isNil(applicationToken)) throw Boom.badRequest('application token is missing')

  try {
    const app = await models.Application.findOne({
      where: { token: applicationToken }
    })
    if (_.isNil(app)) throw Boom.notFound('application is not found')

    const key = `application:${applicationToken}`
    const lastChatNumber = await getLastNumber(key)

    const messageBody = {
      application_token: applicationToken,
      chat_number: lastChatNumber
    }
    await Producer.enqueue(process.env.CHAT_TOPIC, key, messageBody)

    return { chat_number: lastChatNumber }
  } catch (error) {
    logger.error('chat creation failed', error)
    throw error
  }
}

const getApplicationChats = async (req, res) => {
  const { application_token: applicationToken } = req.params

  return models.Chat.findAll({
    where: { applicationToken },
    attributes: { exclude: ['applicationToken'] }
  })
}

module.exports = {
  createChat: wrapAsyncAction(createChat),
  getApplicationChats: wrapAsyncAction(getApplicationChats)
}
