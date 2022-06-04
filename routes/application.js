const AsyncRouter = require('macropress-router')

const router = new AsyncRouter()

const applicationController = require('../controllers/application')

router.post('/', applicationController.createApplication)

module.exports = router
