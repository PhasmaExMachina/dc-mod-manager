import { MODS_SET } from "../actions/mods"

export default (state = {}, action) => {
  if(action.type == MODS_SET) {
    return action.mods
  }
  return state
}