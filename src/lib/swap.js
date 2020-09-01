import RNFS from 'react-native-fs'
import DCTools from '../DCTools'
import store from './store'
import {getModelInfoPath} from './paths'
import {readModelInfo, writeModelInfo} from './model-info'

export default (source, target, sourceCode, targetCode, hash) => {
  DCTools.swap(source, target)
  const {modelInfo, mods, config: {region}} = store.getState()
  if(modelInfo[sourceCode] && modelInfo[targetCode]) {
    return readModelInfo()
    .then(localModelInfo => {
        if(localModelInfo[targetCode]) {
          localModelInfo[targetCode] = mods[hash].modelInfo || modelInfo[sourceCode]
          return writeModelInfo(localModelInfo)
        }
      })
  }
  else return Promise.resolve(new Promise(resolve => resolve()))
}