const AsyncRouter = require('macropress-router')

const router = new AsyncRouter()

router.get('/health', async (req, res) => {
  return {
    status: 'healthy'
  }
})

module.exports = router
