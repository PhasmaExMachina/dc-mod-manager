import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'
import Toast from 'react-native-simple-toast'
import DCTools from './DCTools'

export default ({hash, code, variant}, target) => {
  target = target || code + '_' + variant
  console.log(`https://phasmaexmachina.github.io/destiny-child-mods-archive/characters/${code}_${variant}/${hash}/${code}_${variant}.pck`)
  const options = {
    fileCache : true
  }
  RNFetchBlob.config(options).fetch('GET', `https://phasmaexmachina.github.io/destiny-child-mods-archive/characters/${code}_${variant}/${hash}/${code}_${variant}.pck`).then((res) => {
    const installedTo = [],
          attempts = [],
          regions = {
            Global: 'com.linegames.dcglobal',
            KR: 'com.NextFloor.DestinyChild',
            JP: 'com.stairs.destinychild'
          },
          region = 'global',
          complete = () =>

    console.log(target, code + '_' + variant)
    if(target && target !== code + '_' + variant) {
      DCTools.swap(
        res.path(),
        RNFS.ExternalStorageDirectoryPath + `/Android/data/${regions[region]}/files/asset/character/${target}.pck`
      )
      Toast.show(`Installed ${target} to ${target}`)
    }
    else {
      RNFS.copyFile(res.path(), RNFS.ExternalStorageDirectoryPath + `/Android/data/${regions[region]}/files/asset/character/${target}.pck`)
        .then(() =>
          Toast.show(`Installed ${target} to ${target}`)
        )
        .catch(e => {
          console.log(e)
          Toast.show('Error installing mod:\n' + e.message,  Toast.LONG)
        })
    }
    Promise.all(attempts).then(() => {
      RNFS.unlink(res.path())
      Toast.show(`Installed ${target} to ${target}`)
      // Toast.show(`Installed ${target} to ${installedTo.join(', ')}`)
    })
  })
}