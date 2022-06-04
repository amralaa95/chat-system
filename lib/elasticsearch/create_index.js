
const { searchClient } = require('../../config/elasticsearch')
const ELASTIC_SEARCH_INDEX_NAME = process.env.ELASTIC_SEARCH_INDEX_NAME

const createIndex = async() => {
  const searchIndex = await searchClient.indices.exists({
    index: ELASTIC_SEARCH_INDEX_NAME
  })

  if (!searchIndex.body) {
    const bodyMapping = {
      properties: {
        text: {
          type: 'text'
        },
        application_token: {
          type: 'keyword'
        },
        chat_number: {
          type: 'keyword'
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
createIndex()