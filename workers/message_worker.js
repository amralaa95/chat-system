const { Consumer } = require('../config/kafka_consumer')
const { messageHandler } = require('./handlers/message_handler')
require('../lib/exception-handlers')

const messageConsumer = new Consumer(process.env.MESSAGE_TOPIC, process.env.MESSAGE_CG)
messageConsumer.run(messageHandler)