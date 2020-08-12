export const MODS_SET = 'MODS_SET'
import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'
import Toast from 'react-native-simple-toast'
import swap from '../lib/swap'
import {setLoading} from './loading'
import {getCharactersPath} from '../lib/paths'
import {writeInstalled} from '../lib/installed'
import {loadInstalled} from '../actions/installed'

export const fetchMods = () =>
  (dispatch) => fetch('https://phasmaexmachina.github.io/destiny-child-mods-archive/data/mods.json')
    .then(response => response.json())
    .then(data => dispatch(setMods(data)));

export const setMods = mods => ({type: MODS_SET, mods})

const _install =  ({hash, code, variant}, target, {characters}, dispatch, complete = true) => {
  const source = code + '_' + variant
    target = target || source
  dispatch(setLoading(true, {title: 'Installing mod', message: `Downloading ${source}.pck ...`}))
  return RNFetchBlob.config({fileCache : true}).fetch('GET', `https://phasmaexmachina.github.io/destiny-child-mods-archive/characters/${code}_${variant}/${hash}/${code}_${variant}.pck`).then((res) => {
    const installedTo = [],
          attempts = [],
          complete = () => RNFS.unlink(res.path())
      if(target && target !== source) {
        // install original
        dispatch(setLoading(true, {title: 'Installing mod', message: `Downloading clean ${target} ...`}))
        return _install({code, variant, hash: characters[code].variants[variant].mods[0]}, source, {characters}, dispatch, false)
          .then(() => {
            dispatch(setLoading(true, {title: 'Installing mod', message: `Swapping ${source} into ${target} ...`}))
            return swap(
                res.path(),
                getCharactersPath() + `${target}.pck`,
                source,
                target
              ).then(complete)
            })
      }
      else {
        return RNFetchBlob.fs.cp(res.path(), getCharactersPath() + `${target}.pck`)
          .then(complete)
          .catch(e => {
            console.log(e)
            Toast.show('Error installing mod:\n' + e.message,  Toast.LONG)
          })
      }
  })
}


export const install = ({hash, code, variant}, target) =>
  (dispatch, getState) => {
    _install({hash, code, variant}, target, getState(), dispatch)
      .then(() => {
        Toast.show(`Installed to ${target}`)
        const {installed} = getState()
        installed[target || code + '_' + variant] = {hash}
        dispatch(setLoading(true, {title: 'Saving install information', message: 'Storing installed mod information for later.'}))
        writeInstalled(installed).then(() => dispatch(setLoading(false)))
        dispatch(loadInstalled())
      })
  }