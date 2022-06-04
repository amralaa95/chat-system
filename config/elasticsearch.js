const elasticsearch = require('@elastic/elasticsearch')

module.exports.searchClient = new elasticsearch.Client({
  node: process.env.ELASTIC_SEARCH_URL
})