const Kafka = require('node-rdkafka')
const logger = require('../lib/logger')
const safeJsonStringify = require('safe-json-stringify')

const CLIENT_CONNECTION_TIMEOUT = parseInt(process.env.CLIENT_CONNECTION_TIMEOUT) || 3000 // 3 sec
const KAFKA_BROKER_LIST = process.env.KAFKA_BROKER_LIST

const producerDefaultConfig = {
  'client.id': 'api-kafka-client',
  'metadata.broker.list': KAFKA_BROKER_LIST,
  'retry.backoff.ms': 1,
  'message.send.max.retries': 0,
  'socket.keepalive.enable': true,
  'queue.buffering.max.messages': 1000,
  'queue.buffering.max.kbytes': 102400,
  'batch.num.messages': 1000
}


class Producer {
  constructor (config = {}) {
    this.producer = new Kafka.Producer({ ...producerDefaultConfig, ...config })
    this.producer.setPollInterval(process.env.KAFKA_POLL_INTERVAL)
    this._connect()
    this.producer.on('ready', () => {
      logger.info('Kafka Producer is connected and ready')
    })
      .on('event.error', function (err) {
        logger.error('Kafka Producer Error: ', err)
        throw err
      })
  }

  _connect () {
    this.producer.connect({ timeout: CLIENT_CONNECTION_TIMEOUT }, (err) => {
      if (err && process.env.NODE_ENV !== 'test') {
        throw err
      }
    })
  }

  enqueue (topic, key, body) {
    if (!this.producer._isConnected) {
      this._connect()
      this.producer.on('ready', () => this.enqueue(topic, key, body))
    }

    try {
      this.producer.produce(
        topic,
        null,
        Buffer.from(safeJsonStringify({ body })),
        key,
        Date.now()
      )
    } catch (error) {
      logger.error('kafka producer could not produce message', error)
    }

    // Any errors we encounter, including connection errors
    this.producer.on('event.error', (err) => {
      logger.error('Error from Kafka producer', err)
    })
  }
}

module.exports = {
  Producer: new Producer()
}