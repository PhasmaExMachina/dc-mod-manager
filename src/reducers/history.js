import {VIEW_PUSH} from '../actions/view'
import {HISTORY_POP} from '../actions/history'
import view from './view'

export default (state = [], action) => {
  if(action.type == VIEW_PUSH) {
    state.push({name: action.name, data: action.data})
  }
  if(action.type == HISTORY_POP) {
    return state.slice(0, state.length - 1)
  }
  return state
}