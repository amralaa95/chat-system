const express = require('express')
const router = express.Router()

router.use('/', require('./health'))
router.use('/applications', require('./application'))
router.use('/search', require('./search'))

module.exports = router
