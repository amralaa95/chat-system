const jsonifyError = (err) => JSON.stringify({
  timestamp: new Date(),
  level: 'fatal',
  message: err.message,
  stack: err.stack,
  sql: err.sql
})

process.on('unhandledRejection', function (err) {
  console.error(jsonifyError(err))
  process.exit(1)
})

process.on('uncaughtException', function (err) {
  console.error(jsonifyError(err))
})
