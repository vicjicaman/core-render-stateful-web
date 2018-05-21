import React from "react";
import {hydrate} from "react-dom";
import {loadComponents} from 'loadable-components';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'react-router-redux';
import {ApolloProvider} from 'react-apollo';
import {all, fork} from 'redux-saga/effects';

import configureStore from './store.jsx';
import configureGraphClient from './graph.jsx';

const initState = ({reducers, url, clientState}) => {
  const {store, history} = configureStore({reducers, initState: window.__PRELOADED_STATE__});
  const {graph} = configureGraphClient({client: clientState, url, initState: window.__APOLLO_STATE__});

  return {store, history, graph}
}

const renderHandler = ({AppRoot, store, graph, watchers}) => {

  function* rootSaga() {
    yield all(watchers.map(saga => fork(saga)));
  }

  store.runSaga(rootSaga);

  loadComponents().then(() => {
    hydrate(<AppRoot/>, document.getElementById("root"));
  });

}

export const RenderStateful = ({clientState, App, reducers, watchers, urls: {
    graphql
  }}) => {

  const {store, graph, history} = initState({reducers, url: graphql, clientState})

  const AppRoot = () => {
    return (<ApolloProvider client={graph}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App/>
        </ConnectedRouter>
      </Provider>
    </ApolloProvider>)
  };

  renderHandler({AppRoot, store, graph, watchers})

}
