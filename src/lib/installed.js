import RNFS from 'react-native-fs'
import {getInstalledPath} from './paths'
import store from './store'
import modelInfo from '../reducers/model-info';
import RNFetchBlob from 'rn-fetch-blob'

export const readInstalled = () => {
  return RNFS.exists(getInstalledPath()).then(exists => exists
    ? RNFS.readFile(getInstalledPath())
      .then(installed => JSON.parse(installed))
      .catch(e => console.log('error', e))
    : {}
  )
}


export const writeInstalled = installed => {
  return RNFetchBlob.fs.writeFile(getInstalledPath(), JSON.stringify(installed, null, 2), 'utf8')
}