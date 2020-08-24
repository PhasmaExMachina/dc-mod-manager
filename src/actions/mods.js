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

const _install =  ({hash, code, variant}, target, {characters}, dispatch, message = true) => {
  const source = code + '_' + variant
    target = target || source
  if(message) {
    dispatch(setLoading(true, {title: 'Installing mod', message: `Downloading ${source}.pck ...`}))
  }
  return RNFetchBlob.config({fileCache : true}).fetch('GET', `https://raw.githubusercontent.com/PhasmaExMachina/destiny-child-mods-archive/master/mods/${hash}/${code}_${variant}.pck`).then((res) => {
    const installedTo = [],
          attempts = [],
          complete = () => RNFS.unlink(res.path())
      if(message) {
        dispatch(setLoading(true, {title: 'Installing mod', message: `Installing ${source} into ${target} ...`}))
      }
      return swap(
          res.path(),
          getCharactersPath() + `${target}.pck`,
          source,
          target,
          hash
        ).then(complete)
  })
}

export const install = ({hash, code, variant}, target, message = true) =>
  (dispatch, getState) => {
    _install({hash, code, variant}, target, getState(), dispatch, message)
      .then(() => {
        Toast.show(`Installed to ${target}`)
        const {installed} = getState()
        installed[target || code + '_' + variant] = {hash}
        dispatch(setLoading(true, {title: 'Saving install information', message: 'Storing installed mod information for later.'}))
        writeInstalled(installed).then(() => dispatch(setLoading(false)))
        dispatch(loadInstalled())
      })
  }


export const installList = list =>
  (dispatch, getState) => {
    const targets = Object.keys(list.mods),
          {mods, characters, installed} = getState()
    console.log('installing list', list)
    let i = -1
    const processNextMod = () => {
      i++
      if(i == targets.length) {
        writeInstalled(installed).then(() => {
          dispatch(loadInstalled())
          dispatch(setLoading(false))
        })
        return
      }
      else {
        dispatch(setLoading(true, {
          title: 'Installing ' + list.name,
          message: 'Installing ' + targets[i] + ' ...',
          progress: i,
          total: targets.length
        }))
        const target = targets[i],
              hash = list.mods[target].hash,
              mod = Object.assign({hash}, mods[hash])
        _install(mod, target, {characters}, dispatch, false).then(() => {
          installed[target] = {hash}
          processNextMod()
        })
      }
    }
    processNextMod()
  }