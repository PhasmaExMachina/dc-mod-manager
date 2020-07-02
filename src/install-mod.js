import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'
import Toast from 'react-native-simple-toast'

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
          }
    Object.keys(regions).forEach(region => {
      if(RNFS.exists(RNFS.ExternalStorageDirectoryPath + `/Android/data/${regions[region]}/files/asset/character/`))
        attempts.push(RNFS.copyFile(res.path(), RNFS.ExternalStorageDirectoryPath + `/Android/data/${regions[region]}/files/asset/character/${target}.pck`)
          .then(() => {
            installedTo.push(region)
          })
          .catch(e => {
            console.log(e)
            Toast.show('Error installing mod:\n' + e.message,  Toast.LONG)
          }))
      })
    Promise.all(attempts).then(() => {
      RNFS.unlink(res.path())
      Toast.show(`Installed ${target} to ${installedTo.join(', ')}`)
    })
  })
}