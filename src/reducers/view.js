import {VIEW_SET} from '../actions/view'

export default (state = {}, action) => {
  if(action.type == VIEW_SET) {
    return {
      name: action.name,
      data: action.data
    }
  }
  return state
}