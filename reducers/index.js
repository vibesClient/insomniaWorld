import { combineReducers } from 'redux';
import graphReducer from './graphReducer';

export default combineReducers({
    graph    : graphReducer,
});
