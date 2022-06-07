const express = require('express')
const router = express.Router()

router.get('/health', async (req, res) => {
  return {
    status: 'healthy'
  }
})

module.exports = router
