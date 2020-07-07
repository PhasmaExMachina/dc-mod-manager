/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  Linking,
  StatusBar,
  Alert
} from 'react-native';

import {Provider} from 'react-redux'
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {DefaultTheme, Provider as PaperProvider, Appbar, Menu} from 'react-native-paper';
import store from './store'
import {fetchMods} from './actions/mods'
import {fetchModelInfo} from './actions/model-info'
import {fetchCharacters} from './actions/characters'
import {loadConfig} from './actions/config'
import MainView from './MainView'
import ScrollTop from './ScrollTop';
import DCTools from './DCTools'
import RNFS from 'react-native-fs'
import { pushView } from './actions/view';
import ScaledImage from './ScaledImage'

const theme = {
  ...DefaultTheme,
  roundness: 4,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    // primary: '#9600b6',
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
        requestReadExternalStoragePermission = () => {
          request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((result) => {
            checkReadExternalStorageGranted()
          })
        },
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
                  setReadExternalStorageGranted(true)
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

  useEffect(() => {
    checkReadExternalStorageGranted()
    // Update the document title using the browser API
    store.dispatch(loadConfig())
    store.dispatch(fetchMods())
    store.dispatch(fetchCharacters())
    store.dispatch(fetchModelInfo())
    DCTools.setTmpPath(RNFS.DocumentDirectoryPath + '/tmp')
    DCTools.setAppsPath(RNFS.ExternalStorageDirectoryPath + '/Android/data')
  }, []);
  return readExternalStorageGranted
    ? (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <Appbar.Header dark={true}>
          <TouchableOpacity onPress={() => store.dispatch(pushView(store.getState().config.defaultView)) }>
            <ScaledImage source={require('./icon.png')} width={36} style={{marginLeft: 15}} />
          </TouchableOpacity>
          <Appbar.Content title="DC Mod Manager" onPress={() => store.dispatch(pushView(store.getState().config.defaultView)) }/>
          <Menu
            visible={menuOpen}
            onDismiss={() => setMenuOpen(false)}
            style={{marginTop: 56}}
            anchor={<Appbar.Action icon="dots-vertical" onPress={() => setMenuOpen(true)} color="white" />}>
            <Menu.Item onPress={() => {
              setMenuOpen(false)
              store.dispatch(pushView('characters'))
            }} title="Characters" />
            <Menu.Item onPress={() => {
              setMenuOpen(false)
              store.dispatch(pushView('mods'))
            }} title="Mods" />
            <Menu.Item onPress={() => {
              setMenuOpen(false)
              store.dispatch(pushView('settings'))
            }} title="Settings" />
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
          <ScrollTop>
            <ScrollView contentInsetAdjustmentBehavior="automatic">
              <MainView />
            </ScrollView>
          </ScrollTop>
        </View>
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
