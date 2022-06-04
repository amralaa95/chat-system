const _ = require('lodash')
const Boom = require('boom')
const uuid = require('uuid')
const logger = require('../lib/logger')
const { Producer } = require('../config/kafka_producer')

const createApplication = async (req, res) => {
  const { name } = req.body
  if (_.isNil(name)) throw Boom.badRequest('name is missing')
  const token = uuid.v4()

  try {
    await Producer.enqueue(process.env.APPLICATION_TOPIC, token, { name, token })
    return { token }
  } catch (error) {
    logger.error('application creation failed', error)
    throw error
  }
}

module.exports = {
  createApplication
}
