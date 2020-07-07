import { MODEL_INFO_SET } from "../actions/model-info"

export default (state = {}, action) => {
  if(action.type == MODEL_INFO_SET) {
    return action.modelInfo
  }
  return state
}