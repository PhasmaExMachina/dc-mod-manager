export const CONFIG_SET = 'CONFIG_SET'
import {setLoading} from './loading'
import {setView} from './view'
import RNFS from 'react-native-fs'
import {getSettingsPath, getDestinyChildPath} from '../paths'

export const loadConfig = () =>
  (dispatch) => {
    const installedRegions = [],
          regionPromises = [];
    ['global', 'kr', 'jp'].forEach(region => {
      regionPromises.push(RNFS.exists(getDestinyChildPath(region)).then(exists => {
        if(exists) installedRegions.push(region)
      }))
    })
    Promise.all(regionPromises).then(() => {
      RNFS.exists(getSettingsPath())
        .then(exists => {
          if(!exists) {
            saveConfig({installedRegions}).then(() => dispatch(loadConfig()))
          }
          else {
            RNFS.readFile(getSettingsPath())
              .then(config => {
                try {
                  config = JSON.parse(config)
                }
                catch(e) {
                  config = {}
                }
                config.installedRegions = installedRegions
                if(installedRegions.indexOf(config.region) < 0) config.region = installedRegions[0]
                config.defaultView = config.defaultView || 'mods'
                dispatch(setView(config.defaultView))
                config.defaultModsSortOrder = config.defaultModsSortOrder || 'recently added'
                config.defaultCharacterSortOrder = config.defaultCharacterSortOrder || 'code'
                config.defaultCharacterShow = config.defaultCharacterShow || 'all'
                dispatch(setConfig(config))
              })
              .catch((err) => {
                console.log(err.message, err.code);
              })
          }
        })

    })
  }

const saveConfig = config => RNFS.writeFile(getSettingsPath(), JSON.stringify(config, null, 2))

export const setConfig = config =>
  (dispatch, getState) => {
    config = {...getState().config, ...config}
    dispatch(setLoading(true, {title: 'Saving settings'}))
    dispatch({type: CONFIG_SET, config})
    saveConfig(config).then(() => dispatch(setLoading(false)))
  }