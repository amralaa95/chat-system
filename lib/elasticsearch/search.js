const _ = require('lodash');
const { searchClient } = require('../../config/elasticsearch')

const ELASTIC_SEARCH_INDEX_NAME = process.env.ELASTIC_SEARCH_INDEX_NAME

const _formatFieldsToSearch = (fieldsToMatch) =>
  Object.keys(fieldsToMatch).map(key => {
    return { term: { [key]: fieldsToMatch[key] } };
  });

const searchDocuments = async (fieldsToMatch, messageBody) => {
  const matchMessageBody = _.isNil(messageBody) ? {} : {
    must: {
      match: {
        body: {
          query: messageBody,
          fuzziness: "1" // this will match documents with different on at most one char
        }
      }
    }
  }

  const body = {
    query: {
      bool: {
        filter: _formatFieldsToSearch(fieldsToMatch),
        ...matchMessageBody
      }
    }
  }

  const res = await searchClient.search({
    index: ELASTIC_SEARCH_INDEX_NAME,
    body,
    // size: 30
  })

  return res.body.hits.hits
}

module.exports = {
  searchDocuments
}