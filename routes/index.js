const AsyncRouter = require('macropress-router')

const router = new AsyncRouter()

router.use('/', require('./health'))
router.use('/application', require('./application'))
router.use('/chat', require('./chat'))
router.use('/message', require('./message'))
router.use('/search', require('./search'))

module.exports = router
