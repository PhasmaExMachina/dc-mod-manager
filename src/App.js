/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState, version} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Linking,
  StatusBar,
  Alert
} from 'react-native';

import {Provider} from 'react-redux'
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Portal, Paragraph, Button, Dialog, DefaultTheme, Provider as PaperProvider, Appbar, Menu} from 'react-native-paper';
import store from './lib/store'
import {fetchMods} from './actions/mods'
import {fetchModelInfo} from './actions/model-info'
import {fetchCharacters} from './actions/characters'
import {loadConfig} from './actions/config'
import {loadInstalled} from './actions/installed'
import {loadLists} from './actions/lists'
import MainView from './MainView'
import {getDcModManagerFolderPath} from './lib/paths'
import ScrollTop from './ScrollTop';
import DCTools from './DCTools'
import Drawer from './Drawer'
import RNFS from 'react-native-fs'
import {pushView} from './actions/view';
import {fetchModders} from './actions/modders';
import ScaledImage from './ScaledImage'
import {checkForUpdate, installUpdate} from './lib/update'

const theme = {
  ...DefaultTheme,
  roundness: 4,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#facf32',
    // secondary: '#dd9200',
    accent: '#f1c40f',
    background: '#111',
    paper: '#222',
    surface: '#222',
    text: '#eee',
    placeholder: '#aaa'
  },
};

let readExternalStorageRequested = false

function App() {

  const [readExternalStorageGranted, setReadExternalStorageGranted] = useState(false),
        [menuOpen, setMenuOpen] = useState(false),
        [drawerOpen, setDrawerOpen] = useState(false),
        [update, setUpdate] = useState(false),
        loadInitialData = () => {
          store.dispatch(loadConfig())
          store.dispatch(fetchMods())
          store.dispatch(fetchModders())
          store.dispatch(fetchCharacters())
          store.dispatch(fetchModelInfo())
          store.dispatch(loadLists())
          DCTools.setTmpPath(RNFS.DocumentDirectoryPath + '/tmp')
          DCTools.setAppsPath(RNFS.ExternalStorageDirectoryPath + '/Android/data')
          checkForUpdate().then(setUpdate)
        },
        continueAfterPermissionGranted = () => {
          setReadExternalStorageGranted(true)
          RNFS.exists(getDcModManagerFolderPath())
            .then(exists => exists
              ? loadInitialData()
              : RNFS.mkdir(getDcModManagerFolderPath()).then(loadInitialData)
            )

        },
        requestReadExternalStoragePermission = () =>
          request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((result) => {
            checkReadExternalStorageGranted()
          }),
        checkReadExternalStorageGranted = () => {
          check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
            .then(result => {
              switch (result) {
                case RESULTS.UNAVAILABLE:
                  Alert.alert(
                    'Permission Error',
                    'DC Mod Manager will not work on this device since you cannot grant read external storage permission.',
                    [],
                    {cancelable: false}
                  )
                  break;
                case RESULTS.DENIED:
                  console.log('Read external storage permission denied')
                  if(readExternalStorageRequested) {
                    Alert.alert(
                      'Permission Error',
                      'DC Mod Manager will not work or be able to install mods if it cannot read and write to the Destiny Child app folder in your external storage.',
                      [
                        {text: 'OK', onPress: () => requestReadExternalStoragePermission()}
                      ],
                      {cancelable: false}
                    );
                  }
                  else {
                    readExternalStorageRequested = true
                    requestReadExternalStoragePermission()
                  }
                  break;
                case RESULTS.GRANTED:
                  continueAfterPermissionGranted()
                  break;
                case RESULTS.BLOCKED:
                  console.log('The permission is denied and not requestable anymore');
                  break;
              }
            })
            .catch((error) => {
              // …
            });
          }

  useEffect(() => checkReadExternalStorageGranted(), []);
  return readExternalStorageGranted
    ? (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <Appbar.Header style={{zIndex: 0, backgroundColor: '#69139e'}}>
          <Appbar.Action icon={drawerOpen ? 'close' : 'menu'} onPress={() => setDrawerOpen(!drawerOpen)} />
          {/* <TouchableOpacity onPress={() => store.dispatch(pushView(store.getState().config.defaultView)) }>
            <ScaledImage source={require('./icon.png')} width={36} style={{marginLeft: 15}} />
          </TouchableOpacity> */}
          <Appbar.Content title="DC Mod Manager" onPress={() => {
            setDrawerOpen(false)
            store.dispatch(pushView(store.getState().config.defaultView))
          }}/>
          <Menu
            visible={menuOpen}
            onDismiss={() => setMenuOpen(false)}
            style={{marginTop: 56}}
            anchor={<Appbar.Action icon="dots-vertical" color="white" onPress={() => {
              setDrawerOpen(false)
              setMenuOpen(true)
            }} />}>
            <Menu.Item onPress={() => {
              setMenuOpen(false)
              Linking.openURL('https://github.com/PhasmaExMachina/dc-mod-manager/blob/master/README.md#dc-mod-manager-app-for-android')
            }} title="About" />
            <Menu.Item onPress={() => {
              setMenuOpen(false)
              Linking.openURL('https://github.com/PhasmaExMachina/dc-mod-manager/issues')
            }} title="Feedback" />
            <Menu.Item onPress={() => {
              setMenuOpen(false)
              Linking.openURL('https://github.com/PhasmaExMachina/dc-mod-manager/releases')
            }} title="Releases" />
            <Menu.Item onPress={() => {
              setMenuOpen(false)
              Linking.openURL('https://github.com/PhasmaExMachina/dc-mod-manager/blob/master/README.md#credits')
            }} title="Credits" />
            <Menu.Item onPress={() => {
              setMenuOpen(false)
              Linking.openURL('https://github.com/PhasmaExMachina/dc-mod-manager')
            }} title="Fork on GitHub" />
          </Menu>
          {/* <Appbar.Action icon={MORE_ICON} onPress={() => {}} /> */}
        </Appbar.Header>
        <View style={{flex: 1,backgroundColor: '#111'}}>
          <StatusBar barStyle="dark-content" />
          {/* <ScrollTop> */}
            <MainView />
          {/* </ScrollTop> */}
        </View>
        {drawerOpen && <Drawer onClose={() => setDrawerOpen(false)} />}
        <Portal>
        <Dialog visible={update} onDismiss={() => setUpdate(false)}>
          <Dialog.Title>New update v{update.version} available</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{update.changelog}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setUpdate(false)}>Cancel</Button>
            <Button onPress={() => {
              installUpdate(update.version)
              setUpdate(false)
            }}>Install</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      </PaperProvider>
    </Provider>
  )
  : null
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#111',
  }
});

export default App;
