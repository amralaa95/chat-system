const logger = require('../logger')
const { searchClient } = require('../../config/elasticsearch')
const ELASTIC_SEARCH_INDEX_NAME = process.env.ELASTIC_SEARCH_INDEX_NAME

const createIndex = async() => {
  const searchIndex = await searchClient.indices.exists({
    index: ELASTIC_SEARCH_INDEX_NAME
  })

  if (!searchIndex.body) {
    const bodyMapping = {
      properties: {
        body: {
          type: 'text'
        },
        application_token: {
          type: 'keyword'
        },
        chat_number: {
          type: 'integer'
        },
        message_number: {
          type: 'integer'
        }
      }
    }
    await searchClient.indices.create({
      index: ELASTIC_SEARCH_INDEX_NAME
    })

    await searchClient.indices.putMapping({
      index: ELASTIC_SEARCH_INDEX_NAME,
      body: bodyMapping
    })
  }
}

createIndex().then(() => {
  logger.info('Elasticsearch index created succefully')
  process.exit(0)

})
.catch(error => {
  logger.error('Failed to create Elasticsearch index', error)
  process.exit(1)
})