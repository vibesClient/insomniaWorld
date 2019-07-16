import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';

import Chart from './components/Chart'

const { width } = Dimensions.get("window");
const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
export default () => (
  <Provider store={store}>
    <Chart />
  </Provider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
