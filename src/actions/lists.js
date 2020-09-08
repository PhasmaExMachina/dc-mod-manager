import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'
import {getListsPath} from '../lib/paths'
import toFilename from '../lib/to-filename'
import {setLoading} from './loading'
import {doInstall} from './mods'
import {setView} from './view'

export const LISTS_SET = 'LISTS_SET'
export const LISTS_SET_ACTIVE = 'LISTS_SET_ACTIVE'
export const LISTS_COMMUNITY_SET = 'LISTS_COMMUNITY_SET'

export const loadLists = () =>
  dispatch => {
    fetch('https://phasmaexmachina.github.io/destiny-child-mods-archive/data/lists.json')
      .then(response => response.json())
      .then(listNames => {
        listNames.forEach(listName => {
          console.log(listName)
          return listName != 'index' && fetch(`https://phasmaexmachina.github.io/destiny-child-mods-archive/data/lists/${listName}.json`)
            .then(response => response.json())
            .then(list => dispatch(setCommunityList(listName, list)))
            .catch(e => console.log('Error fetching list', listName))
        })
      })
      .catch(e => console.log('Error fetching lists.json'))
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
  }

export const saveList = (list, oldName, navigate = true) =>
  (dispatch, getState) => {
    const newName = toFilename(list.name)
    list.mods = list.mods || {}
    const doSave = () =>
      RNFetchBlob.fs.writeFile(getListsPath() + newName + '.json', JSON.stringify(list, null, 2), 'utf8')
        .then(() => {
          dispatch(setLoading(false))
          dispatch(loadLists())
          const {active} = getState().lists
          console.log('ACTIVE LIST', active)
          if(list == active) dispatch(setActiveList({...active}))
          if(navigate) dispatch(setView('list', {list}))
        })
    dispatch(setLoading(true, {title: 'Saving list'}))
    console.log('savig', list.name, oldName)
    if(oldName) {
      RNFS.unlink(getListsPath() + toFilename(oldName) + '.json')
        .then(doSave)
        .catch(e => doSave())
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
    // dispatch(setView('list', {list: {...list}}))
  }

export const setCommunityList = (listName, list) => ({
  type: LISTS_COMMUNITY_SET,
  list,
  listName
})