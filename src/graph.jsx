import {ApolloClient} from 'apollo-client';
import {ApolloLink} from 'apollo-link';
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache, IntrospectionFragmentMatcher} from 'apollo-cache-inmemory';
import {getOperationAST} from 'graphql';

// docker-compose exec app bash
// node ./FragmentGenerator.jsx
/*import introspectionQueryResultData from '../fragmentTypes.json';
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});*/

export default({uri, initState}) => ({
  graph: new ApolloClient({
    link: new HttpLink({uri, credentials: 'include'}),
    cache: new InMemoryCache(/* { fragmentMatcher } */).restore(initState),
    ssrForceFetchDelay: 100
  })
})
