const _ = require('lodash')
const logger = require('../../lib/logger')
const models = require('../../models')
const { createDocument, searchDocuments } = require('../../lib/elasticsearch/')

const messageHandler = async ({ message }) => {
  const { value } = message
  const { body: messageBody } = JSON.parse(value)
  const { type, data } = messageBody 
  const { application_token: applicationToken, chat_number: chatNumber, message_number: messageNumber, chat_id: chatId, body } = data
  logger.info(`received new message with type ${type}`, data)

  try {
    switch (type) {
      case 'create': {
        await models.Message.create({
          application_token: applicationToken,
          chat_number: chatNumber,
          message_number: messageNumber,
          body
        })

        await createDocument({
          application_token: applicationToken,
          chat_number: chatNumber,
          message_number: messageNumber,
          body
        })
        break
      }

      case 'update': {
        await models.Message.update({
          body
        },
          {
            where: {
              application_token: applicationToken,
              chat_number: chatNumber,
              message_number: messageNumber,
            }
          })
        const searchRes = await searchDocuments({ application_token: applicationToken, chat_number: chatNumber, message_number: messageNumber })
        const id = !_.isEmpty(searchRes) ? searchRes[0]._id : null

        await createDocument({
          application_token: data.application_token,
          chat_number: chatNumber,
          message_number: messageNumber,
          body
        }, id)

        break
      }
    }
    message.commit()
    return
  } catch (error) {
    logger.error(`error in chat handler with type ${type}`, error)
  }
  return false
}

module.exports = {
  messageHandler
}