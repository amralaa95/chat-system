const _ = require('lodash')

const hideToken = (log, propKey) => {
  let propValue = _.get(log, propKey)
  if (propValue && _.includes(propValue, 'token=')) {
    const tokenMatch = propValue.match(new RegExp('token=([^&]+)'))
    if (_.isArray(tokenMatch) && tokenMatch[1]) {
      const token = tokenMatch[1]
      log = _.set(log, propKey, _.replace(propValue, token, 'X'.repeat(token.length)))
    }
  }
  return log
}

const hideProp = (log, propKey) => {
  const propValue = _.get(log, propKey)
  if (propValue) log = _.set(log, propKey, 'X'.repeat(propValue.length))
  return log
}

const anonymizeLog = (log) => {
  log = hideProp(log, 'options.body.api_key')
  log = hideProp(log, 'options.body.qs.token')

  log = hideToken(log, 'response.request.uri.query')
  log = hideToken(log, 'response.request.uri.search')
  log = hideToken(log, 'response.request.uri.path')
  log = hideToken(log, 'response.request.uri.href')

  return log
}

module.exports = {
  anonymizeLog
}
