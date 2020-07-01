import {setView} from './view'
export const HISTORY_POP = 'HISTORY_POP'

export const popHistory = (history) =>
  dispatch => {
    if(history.length > 1) {
      const previousView = history[history.length - 2]
      dispatch({type: HISTORY_POP})
      dispatch(setView(previousView.name, previousView.data))
    }
  }