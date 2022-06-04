const { createLogger, format, transports } = require('winston')
const { anonymizeLog } = require('./logger-helpers')

const LOG_LEVEL = process.env.LOG_LEVEL || 'info'

const formatLog = format((info) => {
  info = anonymizeLog(info)

  return {
    ...info
  }
})

const logger = createLogger({
  level: LOG_LEVEL || 'info',
  stderrLevels: ['error'],
  format: format.combine(
    format.timestamp(),
    formatLog(),
    format.json()
  ),
  transports: [new transports.Console()]
})

module.exports = logger
