const _ = require('lodash')
const Boom = require('boom')
const models = require('../models')
const logger = require('../lib/logger')
const { getLastNumber } = require('../lib/utils')
const { Producer } = require('../config/kafka_producer')

const createMessage = async (req, res) => {
  const {
    application_token: applicationToken,
    chat_number: chatNumber,
    text
  } = req.body

  if (_.isNil(applicationToken)) throw Boom.badRequest('application token is missing')
  if (_.isNil(chatNumber)) throw Boom.badRequest('chat number is missing')

  try {
    const chat = await models.Chat.findOne({
      where: { applicationToken, number: chatNumber }
    })
    if (_.isNil(chat)) throw Boom.notFound('chat is not found')

    const key = `chat:${applicationToken}|${chatNumber}`
    const lastMessageNumber = await getLastNumber(key)

    const body = { 
      text,
      chat_id: chat.id,
      message_number: lastMessageNumber,
      application_token: applicationToken,
      chat_number: chatNumber
    }
    await Producer.enqueue(process.env.MESSAGE_TOPIC, key, body)

    return { message_number: lastMessageNumber }
  } catch (error) {
    logger.error('message creation failed', error)
    throw error
  }
}

module.exports = {
  createMessage
}
