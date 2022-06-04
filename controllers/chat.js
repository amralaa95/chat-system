const _ = require('lodash')
const Boom = require('boom')
const models = require('../models')
const logger = require('../lib/logger')
const { getLastNumber } = require('../lib/utils')
const { Producer } = require('../config/kafka_producer')

const createChat = async (req, res) => {
  const {
    application_token: applicationToken
  } = req.body

  if (_.isNil(applicationToken)) throw Boom.badRequest('application token is missing')

  try {
    const app = await models.Application.findOne({
      where: { token: applicationToken }
    })
    if (_.isNil(app)) throw Boom.notFound('application is not found')

    const key = `application:${applicationToken}`
    const lastChatNumber = await getLastNumber(key)

    const body = {
      application_token: applicationToken,
      chat_number: lastChatNumber
    }
    await Producer.enqueue(process.env.CHAT_TOPIC, key, body)

    return { chat_number: lastChatNumber }
  } catch (error) {
    logger.error('chat creation failed', error)
    throw error
  }
}

module.exports = {
  createChat
}
