const _ = require('lodash')
const logger = require('../../lib/logger')
const models = require('../../models')
const { searchClient } = require('../../config/elasticsearch')

const ELASTIC_SEARCH_INDEX_NAME = process.env.ELASTIC_SEARCH_INDEX_NAME

const messageHandler = async ({ message }) => {
  const { value } = message
  const { body } = JSON.parse(value)
  logger.info(`received new message`)

  try {
    await models.Message.create({
      chatId: body.chat_id,
      number: body.message_number,
      text: body.text
    })

    await searchClient.index({
      index: ELASTIC_SEARCH_INDEX_NAME, body: {
        application_token: body.application_token,
        chat_number: body.chat_number,
        text: body.text
      }, id: null
    })
    message.commit()
    return
  } catch (error) {
    logger.error(`error while creating chat`, error)
  }
  return false
}

module.exports = {
  messageHandler
}