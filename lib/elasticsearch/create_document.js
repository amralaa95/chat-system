const { searchClient } = require('../../config/elasticsearch')

const ELASTIC_SEARCH_INDEX_NAME = process.env.ELASTIC_SEARCH_INDEX_NAME

const createDocument = async (body, id) => 
  searchClient.index({
    index: ELASTIC_SEARCH_INDEX_NAME,
    body,
    id
  })

module.exports = {
  createDocument
}