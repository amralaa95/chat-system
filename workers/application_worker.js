const { Consumer } = require('../config/kafka_consumer')
const { applicationHandler } = require('./handlers/application_handler')
require('../lib/exception-handlers')

const applicationConsumer = new Consumer(process.env.APPLICATION_TOPIC, process.env.APPLICATION_CG)
applicationConsumer.run(applicationHandler)