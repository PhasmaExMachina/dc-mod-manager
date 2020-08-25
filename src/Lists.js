import React from 'react'
import {connect} from 'react-redux'
import {View} from 'react-native'
import {Headline, Button, Paragraph} from 'react-native-paper'
import {pushView} from './actions/view'

const Lists = ({pushView, lists, community}) => {
  return (
    <View style={{padding: 20}}>
      <Headline style={{marginBottom: 20}}>
        Personal Mod Lists
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
      <View style={{marginTop: 40}}>
        <Headline style={{marginBottom: 20}}>
          Community Mod Lists
        </Headline>
        <Paragraph style={{marginBottom: 20}}>
          The following lists are currated by the community. If you want to suggest a change or submit a list, use the Feedback option in the menu on the top right or ping Phasma on Discord.
        </Paragraph>
        <View style={{marginBottom: 20}}>
          {Object.keys(community).length == 0
            ? <Paragraph>Loading community lists ...</Paragraph>
            : Object.keys(community).map(listName => {
              const list = community[listName]
              return (
                <Button key={list.name} onPress={() => pushView('list', {list})}>
                  {list.name} - {Object.keys(list.mods).length} mods
                </Button>
              )
            })
          }
        </View>
      </View>
    </View>
  )
}

export default connect(
  state => ({
    lists: state.lists.lists,
    community: state.lists.community
  }),
  ({pushView})
)(Lists)