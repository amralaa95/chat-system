const { promisifyAll } = require('bluebird')
let redis = require('redis')
if (process.env.NODE_ENV === 'test') {
  redis = require('redis-mock')
}
promisifyAll(redis.RedisClient.prototype)
promisifyAll(redis.Multi.prototype)
const logger = require('../lib/logger')

const client = redis.createClient({
  url: process.env.REDIS_URL
})

client.on('connect', () => {
  logger.info(`Redis connected to ${client.address}`)
})

client.on('reconnecting', (info) => {
  logger.info(`Redis reconnection attempt #${info.attempt}, delay ${info.delay} ms`)
})

client.on('error', (err) => {
  if (process.env.NODE_ENV !== 'test') {
    logger.error('Redis error', err)
  }
})

module.exports = {
  client
}
