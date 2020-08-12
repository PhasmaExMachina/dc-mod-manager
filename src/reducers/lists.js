import {LISTS_SET, LISTS_SET_ACTIVE} from "../actions/lists"

export default (state = {lists:[]}, action) => {
  if(action.type == LISTS_SET) {
    state = {...state, lists: action.lists}
  }
  if(action.type == LISTS_SET_ACTIVE) {
    state = {...state, active: action.list}
  }
  return state
}