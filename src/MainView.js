import React, {useEffect, useState} from 'react'
import {connect, useStore} from 'react-redux'
import {Paragraph, Dialog, Portal, useTheme, Button, IconButton} from 'react-native-paper'
import Character from './Character'
import ScrollTop from './ScrollTop';
import Characters from './Characters'
import Mods from './Mods'
import Mod from './Mod'
import Variant from './Variant'
import Settings from './Settings'
import Tools from './Tools'
import Modder from './Modder'
import Modders from './Modders'
import InstalledMods from './InstalledMods'
import List from './List'
import Lists from './Lists'
import EditList from './EditList'
import {popHistory} from './actions/history'
import {pushView} from './actions/view'
import {setActiveList} from './actions/lists'
import {BackHandler, Dimensions, View, TouchableOpacity} from 'react-native'

function MainView({view, popHistory, pushView, loading, activeList, setActiveList}) {
  const store = useStore(),
        {colors} = useTheme(),
        [activeListHeight, setActiveListHeight] = useState(0),
        [activeListInfoOpen, setActiveListInfoOpen] = useState(false)
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
    case 'edit-list': CurrentView = EditList; break;
    case 'list': CurrentView = List; break;
    case 'lists': CurrentView = Lists; break;
    case 'modder': CurrentView = Modder; break;
    case 'modders': CurrentView = Modders; break;
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
      {activeListInfoOpen &&
        <Portal>
          <Dialog visible={true} onDismiss={() => setActiveListInfoOpen(false)}>
            <Dialog.Title>Active Mod List</Dialog.Title>
            <Dialog.Content>
              <Paragraph>"{activeList.name}" is the currently active mod list.</Paragraph>
              <Paragraph>To add mods to this list, go to a mod and use the same procedure you would to install the mod to a specific character variant. This will add he mod to the list instead as long as there is an active list open.</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setActiveListInfoOpen(false)}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      }
      <ScrollTop>
        <CurrentView />
      </ScrollTop>
      {activeList &&
        <View style={{
          position: 'absolute',
          // backgroundColor: colors.primary,
          backgroundColor: '#69139e',
          width: '100%',
          padding: 20,
          top: Dimensions.get("window").height - activeListHeight - 80,
          borderTopColor: 'black',
          borderTopWidth: 1
        }}
        onLayout={event => {
          var {x, y, width, height} = event.nativeEvent.layout
          console.log('setting height', height)
          setActiveListHeight(height)
        }}>
          <IconButton
            onPress={() => pushView('list', {list: activeList})}
            icon="playlist-edit"
            style={{
              position: 'absolute',
              top: 8,
              left: 0
            }} />
          <TouchableOpacity onPress={() => pushView('list', {list: activeList})}>
            <Paragraph style={{marginLeft: 30}}>
              {activeList.name} - {Object.keys(activeList.mods).length} mods
            </Paragraph>
          </TouchableOpacity>
          <View style={{
            position: 'absolute',
            right: 10,
            top: 8,
            flexDirection:'row',
            flexWrap:'wrap',
          }}>
            <IconButton onPress={() => setActiveListInfoOpen(true)} icon="information-outline" />
            <IconButton onPress={() => setActiveList(false)} icon="close" />
          </View>
        </View>
      }
    </>
  )
}

export default connect(
  ({view, loading, lists}) => ({
    view,
    loading,
    activeList: lists.active
  }),
  {popHistory, pushView, setActiveList}
)(MainView)