const _ = require('lodash')
const Boom = require('boom')
const models = require('../models')
const { wrapAsyncAction } = require('../lib/express_async')
const logger = require('../lib/logger')
const { getLastNumber } = require('../lib/utils')
const { Producer } = require('../config/kafka_producer')

const createMessage = async (req, res) => {
  const {
    application_token: applicationToken,
    chat_number: chatNumber
  } = req.params
  const { body } = req.body

  if (_.isNil(applicationToken)) throw Boom.badRequest('application token is missing')
  if (_.isNil(chatNumber)) throw Boom.badRequest('chat number is missing')

  try {
    await _validateChat(applicationToken, chatNumber)

    const key = `chat:${applicationToken}|${chatNumber}`
    const messageNumber = await getLastNumber(key)

    await _sendMessage('create', key, { applicationToken, chatNumber, messageNumber, body })

    return { message_number: messageNumber }
  } catch (error) {
    logger.error('message creation failed', error)
    throw error
  }
}

const updateMessage = async (req, res) => {
  const {
    application_token: applicationToken,
    chat_number: chatNumber,
    message_number: messageNumber,
  } = req.params
  const { body } = req.body

  if (_.isNil(applicationToken)) throw Boom.badRequest('application token is missing')
  if (_.isNil(chatNumber)) throw Boom.badRequest('chat number is missing')

  try {
    await _validateChat(applicationToken, chatNumber)

    const message = await models.Message.findOne({
      where: { application_token: applicationToken, chat_number: chatNumber, message_number: messageNumber }
    })
    if (_.isNil(message)) throw Boom.notFound('message is not found')

    const key = `chat:${applicationToken}|${chatNumber}`

    await _sendMessage('update', key, { applicationToken, chatNumber, messageNumber, body })

    return { text: 'Message is updated' }
  } catch (error) {
    logger.error('message updated failed', error)
    throw error
  }
}

const getApplicationChatsMessages = async (req, res) => {
  const { application_token: applicationToken, chat_number: chatNumber } = req.params

  return models.Message.findAll({
    where: { application_token: applicationToken, chat_number: chatNumber },
    attributes: { exclude: ['applicationToken', 'chat_number'] }
  })
}

const _validateChat = async (applicationToken, chatNumber) => {
  const chat = await models.Chat.findOne({
    where: { applicationToken, chat_number: chatNumber }
  })
  if (_.isNil(chat)) throw Boom.notFound('chat is not found')

  return chat
}

const _sendMessage = async (type, key, data) => {
  const { applicationToken, chatNumber, messageNumber, chatId, body } = data

  const messageBody = {
    type,
    data: {
      body,
      chat_id: chatId,
      message_number: messageNumber,
      application_token: applicationToken,
      chat_number: chatNumber
    }
  }
  await Producer.enqueue(process.env.MESSAGE_TOPIC, key, messageBody)
}

module.exports = {
  createMessage: wrapAsyncAction(createMessage),
  updateMessage: wrapAsyncAction(updateMessage),
  getApplicationChatsMessages: wrapAsyncAction(getApplicationChatsMessages)
}
