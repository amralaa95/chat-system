const { Consumer } = require('../config/kafka_consumer')
const { chatHandler } = require('./handlers/chat_handler')
require('../lib/exception-handlers')

const chatConsumer = new Consumer(process.env.CHAT_TOPIC, process.env.CHAT_CG)
chatConsumer.run(chatHandler)