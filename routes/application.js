const express = require('express')
const router = express.Router({mergeParams: true})

const applicationController = require('../controllers/application')

router.post('/', applicationController.createApplication)
router.use('/:application_token/chats', require('./chat'))
router.get('/:application_token', applicationController.getApplication)

module.exports = router
