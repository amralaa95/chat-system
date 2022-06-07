const express = require('express')
const router = express.Router({mergeParams: true})

const messageController = require('../controllers/message')

router.post('/', messageController.createMessage)
router.get('/', messageController.getApplicationChatsMessages)
router.put('/:message_number', messageController.updateMessage)

module.exports = router
