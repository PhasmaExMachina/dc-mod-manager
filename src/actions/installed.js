import {readInstalled} from '../lib/installed'

export const INSTALLED_SET = 'INSTALLED_SET'

export const loadInstalled = () =>
  dispatch => {
    readInstalled().then(installed => {
      dispatch({
        type: INSTALLED_SET,
        installed
      })
    })
  }

