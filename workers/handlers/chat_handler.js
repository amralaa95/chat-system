const _ = require('lodash')
const logger = require('../../lib/logger')
const models = require('../../models')

const chatHandler = async ({ message }) => {
  const { value } = message
  const { body } = JSON.parse(value)
  logger.info(`received new chat`)

  try {
    await models.Chat.create({
      applicationToken: body.application_token,
      chat_number: body.chat_number
    })
    message.commit()
    return
  } catch (error) {
    logger.error(`error while creating chat`, error)
  }
  return false
}

module.exports = {
  chatHandler
}