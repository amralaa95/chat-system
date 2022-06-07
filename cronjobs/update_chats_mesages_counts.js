
const _ = require('lodash')
const logger = require('../lib/logger')
const models = require('../models')
const { getKeys, getValuesOfKeys } = require('../lib/utils')

const main = async () => {
  const [applicationKeys, chatKeys] = await Promise.all([getKeys('application:*'), getKeys('chat:*')])
  const [valuesOfApplicationKeys, valuesOfChatKeys]  = await Promise.all([getValuesOfKeys(applicationKeys),
    getValuesOfKeys(chatKeys)])

  await Promise.all(valuesOfApplicationKeys.map(async (valueWithKey) => {
    const [key, value] = valueWithKey
    const applicaitonToken = key.split('application:')[1]
    await models.Application.update({ chats_count: value }, { where: { token: applicaitonToken } })
  }))

  await  Promise.all(valuesOfChatKeys.map(async (valueWithKey) => {
    const [key, value] = valueWithKey
    const [applicationToken, chatNumber] = key.split('chat:')[1].split('|')
    await models.Chat.update({ messages_count: value }, { where: { applicationToken, chat_number: chatNumber } })
  }))
}

main()
  .then(() => {
    logger.info('Finished updating chats & messages counts')
    process.exit(0)

  })
  .catch(error => {
    logger.error('Shutting down updating chats & messages counts', error)
    process.exit(1)
  })