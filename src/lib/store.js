import {combineReducers, createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import characters from '../reducers/characters'
import history from '../reducers/history'
import mods from '../reducers/mods'
import modelInfo from '../reducers/model-info'
import loading from '../reducers/loading'
import view from '../reducers/view'
import installed from '../reducers/installed'
import config from '../reducers/config'

const store = createStore(combineReducers({
  characters,
  mods,
  view,
  history,
  modelInfo,
  config,
  loading,
  installed
}), applyMiddleware(thunk));

export default store