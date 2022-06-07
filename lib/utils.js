const _ = require('lodash')
const { timeout: promiseTimeout } = require('promise-timeout')
const { client: redisClient } = require('../config/redis')
const logger = require('./logger')

const REDIS_TIMEOUT = 50 // ms

const getLastNumber = async (key) => {
  let lastNumber = await promiseTimeout(redisClient.getAsync(key), REDIS_TIMEOUT)
  lastNumber = _.isNil(lastNumber) ? 1 : parseInt(lastNumber) + 1
  await redisClient.setAsync(key, lastNumber)
  return lastNumber
}

const getKeys = async (prifexKey) => {
  return new Promise((resolve, reject) => {
    return redisClient.keys(prifexKey, (error, keys) => {
      if (error) {
        logger.error(error)
        reject(error)
      } else { 
        resolve(keys) 
      }
    })
  })
}

const getValuesOfKeys = async (keys) => 
  Promise.all(keys.map(async (key) => {
    const value =  await promiseTimeout(redisClient.getAsync(key), REDIS_TIMEOUT)
    return [key, value]
  }))


module.exports = {
  getLastNumber,
  getKeys,
  getValuesOfKeys
}