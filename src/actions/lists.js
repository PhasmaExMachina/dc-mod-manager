import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'
import {getListsPath} from '../lib/paths'
import toFilename from '../lib/to-filename'
import {setLoading} from './loading'
import {setView} from './view'

export const LISTS_SET = 'LISTS_SET'
export const LISTS_SET_ACTIVE = 'LISTS_SET_ACTIVE'

export const loadLists = () =>
  dispatch =>
    RNFS.exists(getListsPath()).then(exists => exists
      ? RNFS.readDir(getListsPath())
        .then(files => {
          const listPromises = [],
                lists = []
          files.forEach(file => {
            if(file.name.match(/\.json/)) {
              listPromises.push(
                RNFetchBlob.fs.readFile(getListsPath() + file.name, "utf8")
                  .then(list => lists.push(JSON.parse(list)))
                  .catch(e => console.log('error', e))
              )
            }
          })
          Promise.all(listPromises).then(() => dispatch({
            type: LISTS_SET,
            lists
          }))
        })
        .catch(e => console.log('error', e))
      : RNFS.mkdir(getListsPath())
        .catch(e => console.log('error', e))
    )

export const saveList = (list, oldName, navigate = true) =>
  dispatch => {
    const newName = toFilename(list.name)
    list.mods = list.mods || {}
    const doSave = () =>
      RNFetchBlob.fs.writeFile(getListsPath() + newName + '.json', JSON.stringify(list, null, 2), 'utf8')
        .then(() => {
          dispatch(setLoading(false))
          dispatch(loadLists())
          if(navigate) dispatch(setView('list', {list}))
        })
    dispatch(setLoading(true, {title: 'Saving list'}))
    console.log('savig', list.name, oldName)
    if(oldName) {
      RNFS.unlink(getListsPath() + toFilename(oldName) + '.json')
        .then(doSave)
        .catch(e => console.log('error', e))
    }
    else doSave()
  }

export const deleteList = (list, navigate = true) =>
  dispatch => {
    RNFetchBlob.fs.unlink(getListsPath() + toFilename(list.name) + '.json')
      .then(() => {
        dispatch(loadLists())
        dispatch(setView('lists'))
      })
      .catch(e => console.log('error', e))
  }

export const setActiveList = list =>  ({
  type: LISTS_SET_ACTIVE,
  list
})

export const addModToList = (mod, target) =>
  (dispatch, getState) => {
    const activeList = getState().lists.active
    activeList.mods[target] = mod
    dispatch(saveList(activeList, false, false))
  }

export const removeModFromList = (target, list) =>
  (dispatch, getState) => {
    delete list.mods[target]
    dispatch(saveList(list, false, false))
    dispatch(setView('list', {list: {...list}}))
  }