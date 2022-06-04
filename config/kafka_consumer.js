const Kafka = require('node-rdkafka')
const logger = require('../lib/logger')
const safeJsonStringify = require('safe-json-stringify')
const async = require('async')

const CLIENT_CONNECTION_TIMEOUT = parseInt(process.env.CLIENT_CONNECTION_TIMEOUT) || 3000 // 3 sec
const KAFKA_BROKER_LIST = process.env.KAFKA_BROKER_LIST

const consumerDefaultConfig = {
  'metadata.broker.list': KAFKA_BROKER_LIST,
  offset_commit_cb: function (err, topicPartitions) {
    if (err) {
      // There was an error committing
      logger.error(err)
    } else {
      // Commit went through. Let's log the topic partitions
      logger.debug('committed successfully - ', topicPartitions)
    }
  },
  'enable.auto.commit': false
}

class Consumer {
  constructor (topic, consumerGroup, earliest = true, config = {}) {
    this.isPaused = false
    this.isSleeping = false

    this.topic = topic
    this.consumer = new Kafka.KafkaConsumer({
      ...consumerDefaultConfig,
      ...{
        ...config,
        'group.id': consumerGroup
      }
    }, {
      'auto.offset.reset': earliest ? 'earliest' : 'latest'
    })

    this._connect()
  }

  _connect () {
    this.consumer.connect({ timeout: CLIENT_CONNECTION_TIMEOUT }, (err) => {
      if (err) {
        throw err
      }
    })
  }

  async internalQueueHandler (data, done) {
    if (!this.isSleeping) {
      const isSuccess = await this.handler({
        message: { ...data, commit: () => this.consumer.commitMessage(data) },
        sleep: this.sleep.bind(this, data)
      })
      if (isSuccess) {
        done()
      }
    }
  }

  async internalQueueDrainHandler () {
    if (this.isPaused && !this.isSleeping) {
      this.consumer.resume(this.consumer.assignments())
      this.isPaused = false
    }
  }

  run (handler) {
    this.handler = handler
    if (!this.consumer._isConnected) {
      this._connect()
    }
    const { topic } = this

    this.consumer
      .on('ready', () => {
        const { globalConfig } = this.consumer
        const { 'group.id': groupId, 'metadata.broker.list': kafkaUri } = globalConfig
        logger.info(`Kafka consumer: listening on topic [${topic}] with group [${groupId}] connected to [${kafkaUri}]`)

        this.internalQueue = async.queue(this.internalQueueHandler.bind(this), 1) //MAX_PARALLEL_HANDLES
        this.internalQueue.drain(this.internalQueueDrainHandler.bind(this))

        this.consumer.subscribe([topic])

        // Consume from the given topic. This is what determines
        // the mode we are running in. By not specifying a callback (or specifying
        // only a callback) we get messages as soon as they are available.
        this.consumer.consume()
      })
      .on('data', (data) => {
        logger.info(`Consuming Data ${safeJsonStringify(data)}`)
        this.internalQueue.push(data)
        if (this.internalQueue.length > 5000) { //MAX_QUEUE_LENGTH
          this.consumer.pause(this.consumer.assignments())
          this.isPaused = true
        }
      })
      .on('event.error', function (err) {
        logger.error('Kafka Consumer Error: ', err)
        throw err
      })
  }

  sleep (data, ms) {
    if (!this.isSleeping) {
      logger.info(`consumer sleep called for ${ms} milliseconds`)
      this.isSleeping = true
      this.internalQueue.pause()
      this.internalQueue.unshift(data)

      setTimeout(() => {
        this.isSleeping = false
        this.internalQueue.resume()
      }, ms)
    }
  }
}

module.exports = {
  Consumer
}