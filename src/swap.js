import RNFS from 'react-native-fs'
import DCTools from './DCTools'
import store from './store'
import {getModelInfoPath} from './paths'

export default (source, target, sourceCode, targetCode) => {
  DCTools.swap(source, target)
  const {modelInfo, config: {region}} = store.getState()
  if(modelInfo[sourceCode]) {
    return RNFS.readFile(getModelInfoPath(), 'utf8')
      .then(localModelInfo => {
        localModelInfo = JSON.parse(localModelInfo)
        if(localModelInfo[targetCode]) {
          localModelInfo[targetCode] = modelInfo[sourceCode]
          return RNFS.writeFile(getModelInfoPath(), JSON.stringify(localModelInfo, null, 2), 'utf-8')
        }
      })
      .catch((err) => {
        console.log(err.message, err.code);
      })
  }
  else return Promise.resolve(new Promise())
}