import React, {useState} from 'react'
import {connect} from 'react-redux'
import {View, TouchableHighlight} from 'react-native'
import InstalledPreview from './InstalledPreview'
import {Dialog, Portal, Paragraph, useTheme, Headline, DataTable, Subheading, Button, Card, TextInput} from 'react-native-paper'
import {pushView} from './actions/view'
import {installList} from './actions/mods'
import {deleteList, setActiveList, removeModFromList} from './actions/lists'
import ModLive2DPreview from './ModLive2DPreview'

const List = ({pushView, view, characters, deleteList, setActiveList, activeList, removeModFromList, installList, isCommunityList}) => {
  const {list, community, page = 0} = view,
        {colors} = useTheme(),
        [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false),
        [confirmInstallOpen, setConfirmInstallOpen] = useState(false),
        [filter, setFilter] = useState(''),
        itemsPerPage = 10,
        modKeys = Object.keys(list.mods).sort(),
        from = page * itemsPerPage,
        to = (page + 1) * itemsPerPage,
        filteredModKeys = filter.replace(/\s/g, '')
          ? modKeys.filter(key => {
            const [code, variant] = key.split('_')
            return (key + characters[code].variants[variant].title + ' ' + characters[code].name).toLowerCase().match(filter.toLowerCase())
          })
          : modKeys
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
      {!community
        ? <>
          <Button
            disabled={activeList == list}
            icon="playlist-plus" mode="contained" onPress={() => setActiveList(list)} style={{marginBottom: 20}}>
            Add mods to this list
          </Button>
          <Button icon="playlist-edit" mode="contained" onPress={() => pushView('edit-list', {list})} style={{marginBottom: 20}}>
            Edit this list
          </Button>
          <Button icon="delete" mode="contained" onPress={() => setConfirmDeleteOpen(true)} style={{marginBottom: 20}}>
            Delete this list
          </Button>
        </>
        : <Button icon="playlist-plus" mode="contained" onPress={() => pushView('edit-list', {list: {mods: list.mods, description: 'Coppied from ' + list.name + ' community list'}})} style={{marginBottom: 20}}>
          Copy to personal lists
        </Button>
      }
      <Button mode="contained" style={{marginBottom: 20}} onPress={() => setConfirmInstallOpen(true)} icon="cellphone-arrow-down">
        Install all {modKeys.length} mods
      </Button>
      <Subheading style={{marginBottom: 20}}>Mods</Subheading>
      <TextInput
        label="Filter by character code or name"
        value={filter}
        onChangeText={setFilter}
        />
      <DataTable.Pagination
        page={page}
        numberOfPages={Math.floor(filteredModKeys.length / itemsPerPage)}
        onPageChange={page => pushView('list', Object.assign({}, view, {page}))}
        label={`${from + 1}-${to} of ${filteredModKeys.length}`}
      />
      <View style={{marginBottom: 20}}>
        {filteredModKeys.length
          ? filteredModKeys.slice(from, to).map(target =>
            <InstalledPreview hash={list.mods[target].hash} key={target} target={target} removeFromList={() => {
              removeModFromList(target, list)
            }}/>
          )
          : <Paragraph>There are no mods in this list yet.</Paragraph>
        }
        <DataTable.Pagination
          page={page}
          numberOfPages={Math.floor(filteredModKeys.length / itemsPerPage)}
          onPageChange={page => pushView('list', Object.assign({}, view, {page}))}
          label={`${from + 1}-${to} of ${filteredModKeys.length}`}
        />
      </View>
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
      <Portal>
        <Dialog visible={confirmInstallOpen} onDismiss={() => setConfirmInstallOpen(false)}>
          <Dialog.Title>Install all mods in this list?</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={{fontWeight: 'bold'}}>This could take around {Math.round(modKeys.length * .05)} minutes.</Paragraph>
            <Paragraph>Are you sure you want to install all {modKeys.length} mods in this list? The process shouldn't be interrupted, so be prepared to leave your phone alone, and maybe plugged in while the list installs.</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmInstallOpen(false)}>Cancel</Button>
            <Button onPress={() => installList(list)}>Confirm</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  )
}

export default connect(
  state => ({
    characters: state.characters,
    view: state.view.data,
    isCommunityList: state.view.data.community,
    activeList: state.lists.active
  }),
  ({pushView, deleteList, setActiveList, removeModFromList, installList})
)(List)