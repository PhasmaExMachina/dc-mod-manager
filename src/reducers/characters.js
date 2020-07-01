import {CHARACTERS_SET} from "../actions/characters"

export default (state = {}, action) => {
  if(action.type == CHARACTERS_SET) {
    return action.characters
  }
  return state
}