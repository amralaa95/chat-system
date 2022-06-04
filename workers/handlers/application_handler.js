const _ = require('lodash')
const logger = require('../../lib/logger')
const models = require('../../models')

const applicationHandler = async ({ message }) => {
  const { value } = message

  const { body } = JSON.parse(value)

  logger.info(`received new application`)
  
  try {
    await models.Application.create({
      name: body.name,
      token: body.token
    })
    message.commit()
    return
  } catch(error) {
    logger.error(`error while creating application`, error)
  }
  return false
}

module.exports = {
  applicationHandler
}