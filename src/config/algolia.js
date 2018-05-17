console.log(process.env);
export default {
  appId: process.env.REACT_APP_ALGOLIA_APPID,
  apiKey: process.env.REACT_APP_ALGOLIA_API_KEY,
  indexName: process.env.REACT_APP_ALGOLIA_INDEX_NAME
}
