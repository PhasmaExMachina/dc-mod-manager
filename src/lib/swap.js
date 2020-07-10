import RNFS from 'react-native-fs'
import DCTools from '../DCTools'
import store from './store'
import {getModelInfoPath} from './paths'
import {readModelInfo, writeModelInfo} from './model-info'

export default (source, target, sourceCode, targetCode) => {
  DCTools.swap(source, target)
  const {modelInfo, config: {region}} = store.getState()
  if(modelInfo[sourceCode]) {
    return readModelInfo()
      .then(localModelInfo => {
        if(localModelInfo[targetCode]) {
          localModelInfo[targetCode] = modelInfo[sourceCode]
          return writeModelInfo(localModelInfo)
        }
      })
  }
  else return Promise.resolve(new Promise())
}