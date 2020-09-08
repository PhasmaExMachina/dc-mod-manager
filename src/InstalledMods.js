import React, {useState} from 'react'
import {View} from 'react-native'
import {Headline, Text, Button, TextInput, DataTable} from 'react-native-paper'
import {connect} from 'react-redux'
import InstalledPreview from './InstalledPreview'
import {pushView} from './actions/view'
import { detectInstalled } from './lib/installed'

const InstalledMods = ({installed, characters, pushView, page = 0}) => {
  const [filter, setFilter] = useState(''),
        modKeys = Object.keys(installed).sort(),
        itemsPerPage = 10,
        filteredModKeys = filter.replace(/\s/g, '')
          ? modKeys.filter(key => {
            const [code, variant] = key.split('_')
            return (key + characters[code].variants[variant].title + ' ' + characters[code].name).toLowerCase().match(filter.toLowerCase())
          })
          : modKeys,
        from = page * itemsPerPage,
        to = Math.min((page + 1) * itemsPerPage, filteredModKeys.length),
        numPages = Math.ceil(filteredModKeys.length / itemsPerPage)
  return (
    <View style={{margin: 20}}>
      <Headline style={{marginBottom:20}}>Installed Mods</Headline>
      <Button icon="playlist-plus" mode="contained" onPress={() => pushView('edit-list', {list: {mods: installed, description: "Backup of my installed mods"}})} style={{marginBottom: 20}}>
        Save {Object.keys(installed).length} mods to a list
      </Button>
      <TextInput
        label="Filter by character code or name"
        value={filter}
        onChangeText={setFilter}
        />
      <DataTable.Pagination
        page={page}
        numberOfPages={numPages}
        onPageChange={page => pushView('installed', {page})}
        label={`${from + 1}-${to} of ${filteredModKeys.length}`}
      />
      {modKeys.length
        ? filteredModKeys.length
          ? filteredModKeys.slice(from, to).map(target =>
            <InstalledPreview hash={installed[target].hash} key={target} target={target} />
          )
          : <Text>No installed mods match your filter</Text>
        : <>
          <Text>It doesn't look like you have installed any mods with this app yet (or since install tracking was implemented). Installed mods should start showing up here once you install some.</Text>
          <Button mode="contained" style={{marginTop: 20, width: '100%'}} onPress={detectInstalled}>
            Detect Installed Mods
          </Button>
        </>
      }
      <DataTable.Pagination
        page={page}
        numberOfPages={numPages}
        onPageChange={page => pushView('installed', {page})}
        label={`${from + 1}-${to} of ${filteredModKeys.length}`}
      />
    </View>
  )
}

export default connect(
  ({installed, characters, view}) => ({
    installed,
    characters,
    page: view.data.page
  }),
  {pushView}
)(InstalledMods)