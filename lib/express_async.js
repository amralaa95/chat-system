const status = require('http-status')

const wrapAsyncAction = (action) => {
  return async (req, res, next) => {
    try {
      let ret = await action(req, res)
      if (res.headersSent) return
      if (ret == null) return res.status(status.NO_CONTENT).end()
      return res.status(res.statusCode || status.OK).json(ret)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = {
  wrapAsyncAction
}
