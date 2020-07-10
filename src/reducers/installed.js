import {INSTALLED_SET} from '../actions/installed'

export default (state = {}, action) => {
  if(action.type == INSTALLED_SET) {
    return {...action.installed}
  }
  return state
}