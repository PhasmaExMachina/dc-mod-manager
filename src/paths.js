import RNFS from 'react-native-fs'
import store from './store'

const regions = {
  global: 'com.linegames.dcglobal',
  kr: 'com.NextFloor.DestinyChild',
  jp: 'com.stairs.destinychild'
}

export const getDestinyChildPath = () => {
  const {config: {region}} = store.getState()
  return RNFS.ExternalStorageDirectoryPath + `/Android/data/${regions[region]}/`
}

export const getCharactersPath = () => {
  return getDestinyChildPath() + 'files/asset/character/'
}

export const getModelInfoPath = () => {
  return getCharactersPath() + 'model_info.json'
}