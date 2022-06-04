const logger = require('./lib/logger')
const db = require('./models/index')

const { app } = require('./app')

logger.debug('Starting server')

// Start Express server.
const server = app.listen(app.get('port'), () => {
  logger.info(`Server is up`, { port: app.get('port'), env: app.get('env') })
})

// Graceful shutdown for not accepting more requests & close all connections
const gracefulShutdown = () => {
  logger.info('Closing http server')
  server.close(() => {
    logger.info('Closing MySQL connections')
    db.sequelize.close()
    logger.info('Exit process successfully')
    process.exit(0)
  })
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)
process.on('SIGHUP', gracefulShutdown)

module.exports = { server }
