/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert
} from 'react-native';
import {combineReducers, createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {DefaultTheme, Provider as PaperProvider, Appbar} from 'react-native-paper';
import characters from './reducers/characters'
import history from './reducers/history'
import mods from './reducers/mods'
import view from './reducers/view'
import {fetchMods} from './actions/mods'
import {fetchCharacters} from './actions/characters'
import MainView from './MainView'
import ScrollTop from './ScrollTop';
import DCTools from './DCTools'

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

const store = createStore(combineReducers({
  characters,
  mods,
  view,
  history
}), applyMiddleware(thunk));

let readExternalStorageRequested = false

function App() {

  const [readExternalStorageGranted, setReadExternalStorageGranted] = useState(false),
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
    store.dispatch(fetchMods())
    store.dispatch(fetchCharacters())
  }, []);
  return readExternalStorageGranted
    ? (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <Appbar.Header dark={true}>
          <Appbar.Content title="DC Mod Manager" />
          {/* <Appbar.Action icon="magnify" onPress={() => {}} /> */}
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