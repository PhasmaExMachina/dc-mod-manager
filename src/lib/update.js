import store from '../lib/store'
import {setLoading} from '../actions/loading'
import currentVersion from '../version.json'
import RNFetchBlob from "rn-fetch-blob"
import RNApkInstallerN from 'react-native-apk-installer-n'

export const checkForUpdate = () => fetch('https://github.com/PhasmaExMachina/dc-mod-manager/releases')
  .then(response => response.text())
  .then(body => {
    const [_, version] = body.match(/dcmodmanager-v(\d+\.\d+\.\d+).apk/) || []
    let changelog = []
    try {
      changelog = body.match(/<ul>[\s\n\r]*(.+?)[\s\n\r]*<\/ul>/m)[1].replace(/<\/?li>/g, '')
    }
    catch(e) {}
    return currentVersion !== version ? {version, changelog} : false;
  })

export const installUpdate = version => {
  store.dispatch(setLoading(true, {title: `Installing update`, message: `Downloading ... 0%`}))
  return RNFetchBlob.config({fileCache : true})
    .fetch('GET', `https://github.com/PhasmaExMachina/dc-mod-manager/releases/download/v${version}/dcmodmanager-v${version}.apk`)
    .progress((received, total) => {
      store.dispatch(setLoading(true, {title: `Installing update`, message: `Downloading ... ${Math.round((received / total) * 100)}%`}))
    })
    .then(res => {
      RNApkInstallerN.install(res.path())
      store.dispatch(setLoading(false))
    })
}