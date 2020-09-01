import RNFS from 'react-native-fs'
import {getInstalledPath, getCharactersPath} from './paths'
import store from './store'
import modelInfo from '../reducers/model-info';
import RNFetchBlob from 'rn-fetch-blob'
import {loadInstalled} from '../actions/installed';
import {setLoading} from '../actions/loading'
import { pushView } from '../actions/view';
import swap from '../lib/swap'

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

export const detectInstalled = () => {
  store.dispatch(setLoading(true, {title: 'Detecting installed mods'}))
  let numLoaded = 0
  readInstalled().then(installed => {
    const {mods, characters} = store.getState()
    RNFetchBlob.fs.ls(getCharactersPath()).then(files => {
      const hashPromises = [],
      pckFiles = files.filter(file => file.match(/\.pck$/))
      let i = -1;
      const processNextHash = () => {
        i++
        const file = pckFiles[i],
              target = file.replace(/\.pck$/, ''),
              [targetCode, targetVariant] = target.split('_')
        store.dispatch(setLoading(true, {title: 'Detecting installed mods',
          message: 'Processing ' + file  + ' ...',
          progress: i, total: pckFiles.length
        }))
        RNFetchBlob.fs.hash(getCharactersPath() + file, 'md5')
          .then(hash => {
            if(i == pckFiles.length - 1) {
              store.dispatch(setLoading(true, {title: 'Detecting installed mods', message: 'Saving installed mods ...'}))
              writeInstalled(installed).then(() => {
                store.dispatch(setLoading(false))
                store.dispatch(loadInstalled())
                store.dispatch(pushView('installed'))
              })
            }
            else {
              const mod = mods[hash],
                    {code, variant} = mod || {}
              if(mod && characters[targetCode] && characters[targetCode].variants[targetVariant] && characters[targetCode].variants[targetVariant].mods[0] != hash) {
                installed[target] = {hash}
                processNextHash()
              }
              else {
                RNFS.copyFile(getCharactersPath() + file, getCharactersPath() + 'c999_00.pck')
                  .then(() => {
                    swap(
                      getCharactersPath() + file,
                      getCharactersPath() + 'c999_00.pck'
                    ).then(() => {
                      RNFS.readDir(RNFS.DocumentDirectoryPath + '/tmp/swap_target').then(dirs => {
                        const hashPromises = []
                        let textureHash = ''
                        dirs.map(({name}) => name).filter(name => name.match(/\.png$/)).forEach(name => {
                          hashPromises.push(
                            RNFetchBlob.fs.hash(RNFS.DocumentDirectoryPath + '/tmp/swap_target/' + name, 'md5').then(hash => textureHash += hash)
                          )
                        })
                        Promise.all(hashPromises).then(() => {
                          const hash = Object.keys(mods).find(hash => {
                            const mod = mods[hash]
                            return mod.textureHash == textureHash
                          })
                          if(hash && characters[targetCode] && characters[targetCode].variants[targetVariant] && characters[targetCode].variants[targetVariant].mods[0] != hash) installed[target] = {hash}
                          processNextHash()
                        })
                      })
                    })
                  })
              }
            }
          })
      }
      processNextHash()
      //   store.dispatch(setLoading('Detecting installed mods', '', 0, pckFiles.length))
      //   hashPromises.push(
      //     RNFetchBlob.fs.hash(getCharactersPath() + file, 'md5')
      //     .then(hash => {
      //       numLoaded++
      //       store.dispatch(setLoading('Detecting installed mods', '', numLoaded, pckFiles.length))
      //       if(mods[hash] && characters[targetCode] && characters[targetCode].variants[targetVariant]) {
      //         installed[target] = {hash}
      //       }
      //     })
      //   )
      // })
      // Promise.all(hashPromises).then(() => {
      //   writeInstalled(installed).then(() => {
      //     store.dispatch(setLoading(false))
      //     store.dispatch(loadInstalled())
      //   })
      // })
    })
  })
}