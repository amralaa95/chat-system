const { searchClient } = require('../../config/elasticsearch')

const ELASTIC_SEARCH_INDEX_NAME = process.env.ELASTIC_SEARCH_INDEX_NAME

const _formatFieldsToSearch = (fieldsToMatch) =>
  Object.keys(fieldsToMatch).map(key => {
    return { match: { [key]: fieldsToMatch[key] } };
  });

const search = async (applicationToken, chatNumber, text) => {
  const fieldsToMatch = {
    application_token: applicationToken,
    chat_number: chatNumber
  }
  const requestData = {
    index: ELASTIC_SEARCH_INDEX_NAME,
    body: {
      query: {
        filtered: {
          filter: [..._formatFieldsToSearch(fieldsToMatch),
            {
              "query_string" : {
                 "query" : text
              }
           }
          ]
        },
        // match: {
        //   text:{
        //     query: text,
            // operator: "and",
            // fuzziness: "auto"
        //   }
        // }

      }
    }
  }
  return searchClient.search(requestData)
}

module.exports = { 
  search
}