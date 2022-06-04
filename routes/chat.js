const AsyncRouter = require('macropress-router')

const router = new AsyncRouter()

const chatController = require('../controllers/chat')

router.post('/', chatController.createChat)

module.exports = router
