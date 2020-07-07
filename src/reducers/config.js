import {CONFIG_SET} from '../actions/config'

const defaultConfig = {region: 'global'}

export default (state = defaultConfig, action) => {
  if(action.type === CONFIG_SET) {
    return {...state, ...action.config}
  }
  return state
}