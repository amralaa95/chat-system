const AsyncRouter = require('macropress-router')

const router = new AsyncRouter()

const messageController = require('../controllers/message')

router.post('/', messageController.createMessage)

module.exports = router
