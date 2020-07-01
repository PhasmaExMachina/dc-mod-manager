import {scrollToTop} from '../ScrollTop'

export const VIEW_PUSH = 'VIEW_PUSH'
export const VIEW_SET = 'VIEW_SET'

export const pushView = (name, data = {}) => {
  return dispatch => {
    dispatch({type: VIEW_PUSH, name, data})
    dispatch(setView(name, data))
  }
}

export const setView = (name, data = {}) => {
  scrollToTop()
  return ({type: VIEW_SET, name, data})
}