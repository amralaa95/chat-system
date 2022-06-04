require('./lib/exception-handlers')

const express = require('express')

const { boomifyErrorsMiddleware, errorHandlerMiddleware } = require('./middlewares/error')
const { loggerMiddleware, errorLoggerMiddleware } = require('./middlewares/http-logger')

const router = require('./routes')

const app = express()


app.set('port', process.env.PORT || 3000)

app.use(express.json({limit: '1MB'}))
app.use(loggerMiddleware)
app.use(router)

app.use(boomifyErrorsMiddleware)
app.use(errorLoggerMiddleware)

app.use(errorHandlerMiddleware)

module.exports = { app }
