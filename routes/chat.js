const express = require('express')
const router = express.Router({mergeParams: true})

const chatController = require('../controllers/chat')

router.post('/', chatController.createChat)
router.get('/', chatController.getApplicationChats)
router.use('/:chat_number/messages',  require('./message'))

module.exports = router
