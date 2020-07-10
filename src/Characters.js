import React, {useState} from 'react'
import {connect} from 'react-redux'
import {
  View,
  Button
} from 'react-native'
import {TextInput, Menu, DataTable, Headline} from 'react-native-paper'
import ScaledImage from './ScaledImage'
import ModPreview from './ModPreview'
import CharacterPreview from './CharacterPreview'
import {pushView} from './actions/view'

function Mods({mods, characters, config, view, pushView}) {
  if(!config.defaultCharacterSortOrder) return null
  const [filter, setFilter] = useState(''),
        [sortMenuVisible, setSortMenuVisible] = useState(false),
        [showMenuVisible, setShowMenuVisible] = useState(false),
        page = view.data.page || 0,
        show = view.data.show || config.defaultCharacterShow,
        sort = view.data.sort || config.defaultCharacterSortOrder,
        setPage = p => pushView('characters', {...view.data, page: p}),
        setSortAndClose = val => {
          pushView('characters', {...view.data, page: 0, sort: val}),
          setSortMenuVisible(false)
        },
        setShowAndClose = val => {
          pushView('characters', {...view.data, page: 0, show: val}),
          setShowMenuVisible(false)
        },
        itemsPerPage = 10,
        from = page * itemsPerPage,
        to = (page + 1) * itemsPerPage
  let filtered = Object.keys(characters).reduce((acc, code) => {
    if(!filter || (`${characters[code].name} ${characters[code].code}`).toLowerCase().match(filter.toLowerCase())) {
      acc.push(characters[code])
    }
    return acc
  }, [])
  // if(sort == 'recently added') {
  //   filtered = filtered.sort((a, b) => a.created > b.created ? -1 : b.created > a.created ? 1 : 0)
  // }
  // if(sort == 'oldest') {
  //   filtered = filtered.sort((a, b) => a.created < b.created ? -1 : b.created < a.created ? 1 : 0)
  // }
  if(show === 'childs') {
    filtered = filtered.filter(({code}) => code.match(/^c\d\d\d/))
  }
  if(show === 'spa childs') {
    filtered = filtered.filter(({code}) => code.match(/^sc\d\d\d/))
  }
  if(show === 'monsters') {
    filtered = filtered.filter(({code}) => code.match(/^m\d\d\d/))
  }
  if(show === 'spa monsters') {
    filtered = filtered.filter(({code}) => code.match(/^sm\d\d\d/))
  }
  if(show === 'other') {
    filtered = filtered.filter(({code}) => code.match(/^v\d\d\d/))
  }
  if(sort == 'name') {
    filtered = filtered.sort((a, b) => {
      a = a.name
      b = b.name
      return a < b ? -1 : b < a ? 1 : 0
    })
  }
  if(sort == 'code' || sort == 'code-desc') {
    filtered = filtered.sort((a, b) => {
      a = a.code
      b = b.code
      return a < b ? -1 : b < a ? 1 : 0
    })
  }
  if(sort.match('-desc')) filtered.reverse()
  return (
    <View style={{padding: 20}}>
      <Headline style={{paddingBottom: 20}}>Characters</Headline>
      <View style={{paddingBottom: 20}}>
        <TextInput label="Filter" onChangeText={text => setFilter(text)}/>
      </View>
      <View style={{marginBottom: 20}}>
        <Menu
          visible={showMenuVisible}
          style={{marginTop: 46}}
          onDismiss={() => setShowMenuVisible(false)}
          anchor={<Button title={'Show ' + show} onPress={() => setShowMenuVisible(true)} />}>
          <Menu.Item onPress={() => setShowAndClose('all')} title="Show all" />
          <Menu.Item onPress={() => setShowAndClose('childs')} title="Show childs" />
          <Menu.Item onPress={() => setShowAndClose('spa childs')} title="Show spa childs" />
          <Menu.Item onPress={() => setShowAndClose('monsters')} title="Show monsters" />
          <Menu.Item onPress={() => setShowAndClose('spa monsters')} title="Show spa monsters" />
          <Menu.Item onPress={() => setShowAndClose('other')} title="Show other" />
        </Menu>
      </View>
      <View style={{marginBottom: 20}}>
        <Menu
          visible={sortMenuVisible}
          style={{marginTop: 46}}
          onDismiss={() => setSortMenuVisible(false)}
          anchor={<Button title={'Sorted by ' + sort} onPress={() => setSortMenuVisible(true)} />}>
          <Menu.Item onPress={() => setSortAndClose('code')} title="Sort by code" />
          <Menu.Item onPress={() => setSortAndClose('code-desc')} title="Sort by code descending" />
          <Menu.Item onPress={() => setSortAndClose('name')} title="Sort by name" />
          <Menu.Item onPress={() => setSortAndClose('name-desc')} title="Sort by name descending" />
        </Menu>
      </View>

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.floor(filtered.length / itemsPerPage)}
        onPageChange={page => setPage(page)}
        label={`${from + 1}-${to} of ${filtered.length}`}
      />
      {filtered.slice(from, to).map(character =>
        <CharacterPreview character={character} key={character.code} />
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