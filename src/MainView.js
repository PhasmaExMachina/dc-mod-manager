import React, {useEffect} from 'react'
import {connect, useStore} from 'react-redux'
import Mods from './Mods'
import Mod from './Mod'
import Character from './Character'
import {popHistory} from './actions/history'
import {pushView} from './actions/view'
import {BackHandler, Alert} from 'react-native'

function MainView({view, popHistory, pushView}) {
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
    case 'mods': CurrentView = Mods; break;
    case 'mod': CurrentView = Mod; break;
    case 'character': CurrentView = Character; break;
  }
  return CurrentView ? <CurrentView /> : null
}

export default connect(
  ({view}) => ({view}),
  {popHistory, pushView}
)(MainView)