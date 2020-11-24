import RNFS from 'react-native-fs'
import store from './store'

const regions = {
  global_tap: 'com.linegames.dcglobal.xsolla',
  global: 'com.linegames.dcglobal',
  kr: 'com.NextFloor.DestinyChild',
  jp: 'com.stairs.destinychild'
}

export const getDcModManagerFolderPath = () => {
  return RNFS.ExternalStorageDirectoryPath + `/DCModManager/`
}

export const getDestinyChildPath = regionOverride => {
  const { config: { region } } = store.getState()
  return RNFS.ExternalStorageDirectoryPath + `/Android/data/${regions[regionOverride || region]}/`
}

export const getCharactersPath = () => {
  return getDestinyChildPath() + 'files/asset/character/'
}

export const getModelInfoPath = () => {
  return getCharactersPath() + 'model_info.json'
}

export const getListsPath = () => {
  return getDcModManagerFolderPath() + 'lists/'
}

export const getSettingsPath = () => {
  return getDcModManagerFolderPath() + '/config.json'
}

export const getInstalledPath = () => {
  const region = store.getState().config.region
  return getDcModManagerFolderPath() + `/installed${region}.json`
}

export  { regions as pathRegions }