import React, {useState} from 'react'
import {connect} from 'react-redux'
import {View, TouchableHighlight} from 'react-native'
import InstalledPreview from './InstalledPreview'
import {Dialog, Portal, Paragraph, useTheme, Headline, Subheading, Button, Card} from 'react-native-paper'
import {pushView} from './actions/view'
import {installList} from './actions/mods'
import {deleteList, setActiveList, removeModFromList} from './actions/lists'

const List = ({pushView, list, deleteList, setActiveList, activeList, removeModFromList, installList, isCommunityList}) => {
  const {colors} = useTheme(),
        [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  return (
    <View style={{padding: 20}}>
      <View style={{paddingBottom: 20, flex: 1, flexDirection: 'row'}}>
        <TouchableHighlight onPress={() => pushView('lists')}>
          <Subheading style={{color: colors.primary}}>Mod Lists</Subheading>
        </TouchableHighlight>
        <Subheading style={{marginLeft: 10, marginRight: 10}}>&gt;</Subheading>
        <Subheading>{list.name}</Subheading>
      </View>
      <Headline style={{marginBottom: 20}}>
        {list.name}
      </Headline>
      {list.description.replace(/\s/g, '') != '' && <Paragraph style={{marginBottom: 20}}>{list.description}</Paragraph>}
      <Subheading style={{marginBottom: 20}}>Mods</Subheading>
      <Button mode="contained" style={{marginBottom: 20}} onPress={() => installList(list)}>
        Install all mods in this list
      </Button>
      <View style={{marginBottom: 20}}>
        {Object.keys(list.mods).length
          ? Object.keys(list.mods).sort().map(target =>
            <InstalledPreview hash={list.mods[target].hash} key={target} target={target} removeFromList={() => {
              removeModFromList(target, list)
            }}/>
          )
          : <Paragraph>There are no mods in this list yet.</Paragraph>
        }
      </View>
      {!isCommunityList
        ? <>
          <Button
            disabled={activeList == list}
            icon="playlist-plus" mode="contained" onPress={() => setActiveList(list)} style={{marginBottom: 20}}>
            Add Mods
          </Button>
          <Button icon="playlist-edit" mode="contained" onPress={() => pushView('edit-list', {list})} style={{marginBottom: 20}}>
            Edit
          </Button>
          <Button icon="delete" mode="outlined" onPress={() => setConfirmDeleteOpen(true)} style={{marginBottom: 20}}>
            Delete
          </Button>
        </>
        : <Button mode="contained" onPress={() => pushView('edit-list', {list: {mods: list.mods, name: list.name + ' - copy'}})}>
          Copy to personal lists
        </Button>
      }
      <Portal>
        <Dialog visible={confirmDeleteOpen} onDismiss={() => setConfirmDeleteOpen(false)}>
          <Dialog.Title>Delete this list?</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to delete the list called "{list.name}"? This CANNOT be undone.</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmDeleteOpen(false)}>Cancel</Button>
            <Button onPress={() => deleteList(list)}>Confirm</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  )
}

export default connect(
  state => ({
    list: state.view.data.list,
    isCommunityList: state.view.data.community,
    activeList: state.lists.active
  }),
  ({pushView, deleteList, setActiveList, removeModFromList, installList})
)(List)