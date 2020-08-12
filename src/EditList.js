import React, {useState} from 'react'
import {connect} from 'react-redux'
import {View, TouchableHighlight, Alert} from 'react-native'
import {Dialog, Paragraph, TextInput, useTheme, Headline, Subheading, Button, Portal} from 'react-native-paper'
import {pushView} from './actions/view'
import {saveList} from './actions/lists'
import toFilename from './lib/to-filename'

const EditList = ({pushView, saveList, list, lists}) => {
  const {colors} = useTheme(),
        [name, setName] = useState(list.name || ''),
        [description, setDescription] = useState(list.description || ''),
        [error, setError] = useState(false),
        saveListIfValid = () => {
          if(!name.replace(/\s/g, '')) {
            setError('List name cannot be empty')
          }
          else if(list.name != name && lists.map(l => toFilename(l.name)).indexOf(toFilename(name)) > -1) {
            setError('A list with that name already exists')
          }
          else saveList(Object.assign({}, list, {name, description}), list.name)
        }
  return (
    <View style={{padding: 20}}>
      <View style={{paddingBottom: 20, flex: 1, flexDirection: 'row'}}>
        <TouchableHighlight onPress={() => pushView('lists')}>
          <Subheading style={{color: colors.primary}}>Mod Lists</Subheading>
        </TouchableHighlight>
        <Subheading style={{marginLeft: 10, marginRight: 10}}>&gt;</Subheading>
        {list.name && <>
          <TouchableHighlight onPress={() => pushView('list', {list})}>
            <Subheading style={{color: colors.primary}}>{list.name}</Subheading>
          </TouchableHighlight>
          <Subheading style={{marginLeft: 10, marginRight: 10}}>&gt;</Subheading>
        </>}
        <Subheading>{list.name ? 'Edit' : 'New List'}</Subheading>
      </View>
      <Headline style={{marginBottom: 20}}>
        {list.name ? 'Edit List' : 'Create a new list'}
      </Headline>
      <View style={{marginBottom: 20}}>
        <TextInput
          label="List Name"
          value={name}
          autoFocus={true}
          error={error}
          onChangeText={setName} />
      </View>
      <View style={{marginBottom: 20}}>
        <TextInput
          label="List Description"
          value={description}
          onChangeText={setDescription} />
      </View>
      <View style={{flexDirection:'row', flexWrap:'wrap'}}>
        <Button mode="outlined" onPress={() => {
          if(list.name) pushView('list', {list})
          else pushView('lists')
        }} style={{marginRight: 20}}>
          Cancel
        </Button>
        <Button mode="contained" onPress={saveListIfValid}>
          Save
        </Button>
      </View>
      <Portal>
        <Dialog visible={error} onDismiss={() => setError(false)}>
          <Dialog.Title>Error</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{error}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setError(false)}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  )
}

export default connect(
  state => ({
    lists: state.lists.lists,
    list: state.view.data.list || {}
  }),
  ({pushView, saveList})
)(EditList)