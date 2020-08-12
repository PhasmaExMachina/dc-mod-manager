import React from 'react'
import {connect} from 'react-redux'
import {View} from 'react-native'
import {Headline, Button, Paragraph} from 'react-native-paper'
import {pushView} from './actions/view'

const Lists = ({pushView, lists}) => {
  return (
    <View style={{padding: 20}}>
      <Headline style={{marginBottom: 20}}>
        Mod Lists
      </Headline>
      <View style={{marginBottom: 20}}>
        {lists.length == 0
          ? <Paragraph>You have not created any lists yet</Paragraph>
          : lists.map(list =>
            <Button key={list.name} onPress={() => pushView('list', {list})}>
              {list.name} - {Object.keys(list.mods).length} mods
            </Button>
          )
        }
      </View>
      <Button mode="contained" onPress={() => pushView('edit-list')}>
        New List
      </Button>
    </View>
  )
}

export default connect(
  state => ({
    lists: state.lists.lists
  }),
  ({pushView})
)(Lists)