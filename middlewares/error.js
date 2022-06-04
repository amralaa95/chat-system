const Boom = require('boom')

/**
 * Boomify all errors & add statusCode at root error level,
 *  should be placed before any error handler
 */
const boomifyErrorsMiddleware = (err, req, res, next) => {
  if (!err) return next()

  const boomErr = err.isBoom ? Object.assign(err, {statusCode: err.output.statusCode})
    : Boom.boomify(err)
  res.statusCode = err.output.statusCode
  return next(boomErr)
}

/**
 * Handle errors and send them accordingly to clients,
 *  should be placed after all error handlers
 */
const errorHandlerMiddleware = (err, req, res, next) => {
  if (!err) return next()
  const payload = Object.assign({},
    err.output.payload,
    err.data && err.data,
    process.env.NODE_ENV !== 'production' && { stack: err.stack }
  )
  return res.status(err.output.statusCode).json(payload)
}

module.exports = {
  boomifyErrorsMiddleware,
  errorHandlerMiddleware
}
