const { createLogger, format, transports, exceptions } = require('winston')
const expressWinston = require('express-winston')
const LOG_LEVEL = process.env.HTTP_LOG_LEVEL || process.env.LOG_LEVEL || 'info'

expressWinston.requestWhitelist.push('body')
expressWinston.bodyBlacklist.push('name', 'email', 'phone', 'paymobToken', 'paymobMerchantId', 'maskedPan', 'maskedPanPrefix', 'billing_data')

const consoleLogger = createLogger({
  level: LOG_LEVEL,
  stderrLevels: ['warn', 'error'],
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [new transports.Console()]
})

const loggerMiddleware = expressWinston.logger({
  winstonInstance: consoleLogger,
  meta: true,
  msg: 'HTTPS {{req.method}} {{req.url}} - {{res.statusCode}} {{res.responseTime}}ms',
  expressFormat: false,
  colorize: false,
  dynamicMeta: (req, res) => ({ res: { statusCode: res.statusCode, responseTime: res.responseTime } }),
  ignoredRoutes: ['/health']
})

const errorLoggerMiddleware = expressWinston.errorLogger({
  winstonInstance: consoleLogger,
  level: (req, res, err) => err.isServer ? 'error' : 'warn',
  exceptionToMeta: (err) => err.isServer ? exceptions.getAllInfo(err) : {},
  dynamicMeta: (req, res) => ({ res: { statusCode: res.statusCode } }),
  msg: '{{err.message}} {{res.statusCode}} - {{req.method}} {{req.url}} correlation-id:{{req.correlationId}}'
})

module.exports = {
  loggerMiddleware,
  errorLoggerMiddleware
}
