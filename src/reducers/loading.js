import {LOADING_SET_LOADING} from '../actions/loading'

export default (state = {}, action) => {
  if(action.type == LOADING_SET_LOADING) {
    const loading = Object.assign({}, action)
    delete loading.type
    return loading
  }
  return state
}