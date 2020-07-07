import RNFS from 'react-native-fs'
import {getModelInfoPath} from './paths'
import store from './store'
import modelInfo from './reducers/model-info';
import RNFetchBlob from 'rn-fetch-blob'

export const readModelInfo = () =>
  RNFS.readFile(getModelInfoPath())
    .then(localModelInfo => JSON.parse(localModelInfo), 'utf8')

export const writeModelInfo = modelInfo =>
  RNFetchBlob.fs.writeFile(getModelInfoPath(), JSON.stringify(modelInfo, null, 2), 'utf8')