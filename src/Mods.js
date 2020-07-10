import React, {useState} from 'react'
import {connect} from 'react-redux'
import {
  View,
  Button
} from 'react-native'
import {TextInput, Menu, DataTable, Headline} from 'react-native-paper'
import {pushView} from './actions/view'
import ModPreview from './ModPreview'
import {scrollToTop} from './ScrollTop'

function Mods({mods, characters, config, view, pushView}) {
  if(!config.defaultModsSortOrder) return null
  const [filter, setFilter] = useState(''),
        [sortMenuVisible, setSortMenuVisible] = useState(false),
        page = view.data.page || 0,
        sort = view.data.sort || config.defaultModsSortOrder,
        setPage = p => pushView('mods', {...view.data, page: p})
        setSortAndClose = val => {
          pushView('mods', {...view.data, sort: val, page: 0})
          setSortMenuVisible(false)
        },
        itemsPerPage = 10,
        from = page * itemsPerPage,
        to = (page + 1) * itemsPerPage
  let filtered = Object.keys(mods).reduce((acc, hash) => {
    const {code, variant} = mods[hash]
    if(!filter || ((characters[code] ? (characters[code].name || '') : '') + code + '_' + variant).toLowerCase().match(filter.toLowerCase())) {
      acc.push({...mods[hash], hash})
    }
    return acc
  }, [])
  if(sort == 'recently added') {
    filtered = filtered.sort((a, b) => a.created > b.created ? -1 : b.created > a.created ? 1 : 0)
  }
  if(sort == 'oldest') {
    filtered = filtered.sort((a, b) => a.created < b.created ? -1 : b.created < a.created ? 1 : 0)
  }
  if(sort == 'name') {
    filtered = filtered.sort((a, b) => {
      a = characters[mods[a.hash].code].name
      b = characters[mods[b.hash].code].name
      return a < b ? -1 : b < a ? 1 : 0
    })
  }
  if(sort == 'code') {
    filtered = filtered.sort((a, b) => {
      a = mods[a.hash].code + '_' + mods[a.hash].variant
      b = mods[b.hash].code + '_' + mods[b.hash].variant
      return a < b ? -1 : b < a ? 1 : 0
    })
  }
  return (
    <View style={{padding: 20}}>
      <Headline style={{paddingBottom: 20}}>Mods</Headline>
      <View style={{paddingBottom: 20}}>
        <TextInput label="Filter" onChangeText={text => setFilter(text)}/>
      </View>
      <View style={{marginBottom: 20}}>
        <Menu
          visible={sortMenuVisible}
          style={{marginTop: 46}}
          onDismiss={() => setSortMenuVisible(false)}
          anchor={<Button title={'Sorted by ' + sort} onPress={() => setSortMenuVisible(true)} />}>
          <Menu.Item onPress={() => setSortAndClose('code')} title="Sort by code" />
          <Menu.Item onPress={() => setSortAndClose('name')} title="Sort by name" />
          <Menu.Item onPress={() => setSortAndClose('recently added')} title="Sort by recently added" />
          <Menu.Item onPress={() => setSortAndClose('oldest')} title="Sort by oldest" />
        </Menu>
      </View>
      <DataTable.Pagination
        page={page}
        numberOfPages={Math.floor(filtered.length / itemsPerPage)}
        onPageChange={page => setPage(page)}
        label={`${from + 1}-${to} of ${filtered.length}`}
      />
      {filtered.slice(from, to).map(({hash}) =>
        <ModPreview key={hash} hash={hash} />
      )}
      <DataTable.Pagination
        page={page}
        numberOfPages={Math.floor(filtered.length / itemsPerPage)}
        onPageChange={page => setPage(page)}
        label={`${from + 1}-${to} of ${filtered.length}`}
      />
    </View>
  )
}

export default connect(
  ({mods, characters, config, view}) => ({mods, characters, config, view}),
  {pushView}
)(Mods)