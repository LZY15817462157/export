const ApolloBoost = require('apollo-boost');  //引入核心
const fetch = require('node-fetch');    // 引入fetch
const { createHttpLink } = require('apollo-link-http'); // 引入http
const {ApolloClient,InMemoryCache} = ApolloBoost // 引入必须设置的客户端及cache
 
const client = new ApolloClient({
  link: createHttpLink({
    uri: "http://192.168.50.152:8888/graphql", // 这个url可以抽取到配置文件里
    fetch: fetch, 
  }),
  cache: new InMemoryCache(),
})

function getQuery(query,variables={}){
  return client.query({
    query,
    variables
  })
}
 
// 这个是类似我们熟悉的post请求
function getMutate(mutation,variables={}){
  return client.mutate({
    mutation,
    variables
  })
}


module.exports = { getQuery,getMutate }