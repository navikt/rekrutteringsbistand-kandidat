import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import SearchPage from './components/Kandidatsok';
import './../styles.less';
import './sok.less';
import searchReducer, { saga } from './domene';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(searchReducer, composeWithDevTools(
    applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(saga);

ReactDOM.render(
    <Provider store={store}>
        <SearchPage />
    </Provider>,
    document.getElementById('app')
);

