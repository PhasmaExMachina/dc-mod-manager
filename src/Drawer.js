import React from 'react'
import {Text, Surface, Drawer, Subheading, TouchableRipple} from 'react-native-paper'
import {Linking, Divider, View, Dimensions, ScrollView, TouchableOpacity} from 'react-native'
import {connect} from 'react-redux'
import {pushView} from './actions/view'
import version from './version.json'

const DrawerNavigation = ({onClose, view, pushView}) => {
  const navigate = (viewName, viewData) => {
    pushView(viewName, viewData)
    onClose()
  }
  return (
    <>
      <TouchableOpacity style={{
        position: 'absolute',
        top: 52,
        left: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        opacity: .5,
        backgroundColor: '#000',
        activeOpacity: 1
      }}
      onPress={onClose}><View></View></TouchableOpacity>
      <Surface style={{
        position: 'absolute',
        top: 52,
        left: 0,
        minWidth: 200,
        height: Dimensions.get('window').height
      }}>
        <ScrollView>
          <View style={{paddingTop: 20, paddingBottom: 20, paddinfLeft: 10, paddingRight: 10}}>
            <Drawer.Item
              label="Mods"
              dark={true}
              icon="puzzle"
              active={view.name === 'mods'}
              onPress={() => navigate('mods')} />
            <Drawer.Item
              label="Characters"
              icon="account"
              active={view.name === 'characters'}
              onPress={() => navigate('characters')} />
            <Drawer.Item
              label="Installed Mods"
              icon="download"
              active={view.name === 'installed'}
              onPress={() => navigate('installed')} />
            <Drawer.Item
              label="Tools"
              icon="hammer"
              active={view.name === 'tools'}
              onPress={() => navigate('tools')} />
            <Drawer.Item
              label="Settings"
              icon="settings"
              active={view.name === 'settings'}
              onPress={() => navigate('settings')} />
            <Drawer.Section style={{margin: 20}} />
            <TouchableRipple style={{margin: 20}} onPress={() => {
              Linking.openURL('https://github.com/PhasmaExMachina/dc-mod-manager/releases')
            }}>
              <Subheading>version {version}</Subheading>
            </TouchableRipple>
          </View>
        </ScrollView>
      </Surface>
    </>
  )
}

export default connect(
  ({view}) => ({view}),
  {pushView}
)(DrawerNavigation)