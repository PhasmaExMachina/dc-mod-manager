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
    RNFS.getAllExternalFilesDirs().then(dirs => console.log(dirs))
    RNFS.moveFile(res.path(), RNFS.ExternalStorageDirectoryPath + `/Android/data/com.linegames.dcglobal/files/asset/character/${target}.pck`)
      .then(() => {
        Toast.show(`Mod installed to ${target}`)
      })
      .catch(e => {
        console.log(e)
        Toast.show('Error installing mod:\n' + e.message,  Toast.LONG)
      })
  })
}