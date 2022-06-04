const AsyncRouter = require('macropress-router')

const router = new AsyncRouter()

const searchController = require('../controllers/search')

router.get('/', searchController.search)

module.exports = router
