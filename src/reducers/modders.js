import {MODDERS_SET} from "../actions/modders"

export default (state = {}, action) => {
  if(action.type == MODDERS_SET) {
    return action.modders
  }
  return state
}