const _ = require('lodash')
const { timeout: promiseTimeout } = require('promise-timeout')
const { client: redisClient } = require('../config/redis')

const REDIS_TIMEOUT = 50 // ms

const getLastNumber = async (key, ) => {
  let lastNumber = await promiseTimeout(redisClient.getAsync(key), REDIS_TIMEOUT)
  lastNumber = _.isNil(lastNumber) ? 1 : parseInt(lastNumber) + 1
  await redisClient.setAsync(key, lastNumber)
  return lastNumber
}

module.exports = {
  getLastNumber
}