import {LISTS_SET, LISTS_SET_ACTIVE, LISTS_COMMUNITY_SET} from "../actions/lists"

export default (state = {lists:[], community: {}}, action) => {
  if(action.type == LISTS_SET) {
    state = {...state, lists: action.lists}
  }
  if(action.type == LISTS_SET_ACTIVE) {
    state = {...state, active: action.list}
  }
  if(action.type == LISTS_COMMUNITY_SET) {
    const {community} = state
    community[action.listName] = action.list
    state = {...state, community: {...community}}
  }
  return state
}