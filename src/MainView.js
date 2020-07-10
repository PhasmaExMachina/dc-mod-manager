import React, {useEffect} from 'react'
import {connect, useStore} from 'react-redux'
import {Paragraph, Dialog, Portal} from 'react-native-paper'
import Character from './Character'
import Characters from './Characters'
import Mods from './Mods'
import Mod from './Mod'
import Variant from './Variant'
import Settings from './Settings'
import Tools from './Tools'
import InstalledMods from './InstalledMods'
import {popHistory} from './actions/history'
import {pushView} from './actions/view'
import {BackHandler, Alert} from 'react-native'

function MainView({view, popHistory, pushView, loading}) {
  const store = useStore()
  useEffect(() => {
    const backAction = () => {
      const history = store.getState().history
      if(history.length > 1) {
        popHistory(history)
        return true
      }
      else return false
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
    pushView('mods')
    return () => backHandler.remove();
  }, []);
  let CurrentView
  switch(view.name) {
    case 'mod': CurrentView = Mod; break;
    case 'installed': CurrentView = InstalledMods; break;
    case 'character': CurrentView = Character; break;
    case 'characters': CurrentView = Characters; break;
    case 'characters': CurrentView = Characters; break;
    case 'settings': CurrentView = Settings; break;
    case 'tools': CurrentView = Tools; break;
    case 'variant': CurrentView = Variant; break;
    default: CurrentView = Mods;
  }
  return (
    <>
      {loading.isLoading && (
        <Portal>
          <Dialog visible={true} dismissable={false}>
            <Dialog.Title>{loading.title}</Dialog.Title>
            <Dialog.Content>
              <Paragraph>{loading.message}</Paragraph>
            </Dialog.Content>
          </Dialog>
        </Portal>
      )}
      <CurrentView />
    </>
  )
}

export default connect(
  ({view, loading}) => ({view, loading}),
  {popHistory, pushView}
)(MainView)