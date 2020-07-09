import React from 'react'
import {Text, Surface, Drawer} from 'react-native-paper'
import {View, Dimensions, ScrollView, TouchableOpacity} from 'react-native'
import {connect} from 'react-redux'
import {pushView} from './actions/view'

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
        backgroundColor: '#333',
        height: Dimensions.get('window').height
      }}>
        <ScrollView>
          <View style={{paddingTop: 20, paddingBottom: 20, paddinfLeft: 10, paddingRight: 10}}>
            <Drawer.Item
              label="Mods"
              dark={true}
              active={view.name === 'mods'}
              onPress={() => navigate('mods')} />
            <Drawer.Item
              label="Characters"
              active={view.name === 'characters'}
              onPress={() => navigate('characters')} />
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