import React, {useState} from 'react'
import {connect} from 'react-redux'
import {
  View,
  Button
} from 'react-native'
import {TextInput, Menu, DataTable, Headline} from 'react-native-paper'
import ScaledImage from './ScaledImage'
import ModPreview from './ModPreview'
import {scrollToTop} from './ScrollTop'
import CharacterPreview from './CharacterPreview'

function Mods({mods, characters, config}) {
  const [filter, setFilter] = useState(''),
        [sortMenuVisible, setSortMenuVisible] = useState(false),
        [sort, setSort] = useState(config.defaultCharacterSortOrder),
        [page, setPageVal] = useState(0),
        setPage = p => {
          setPageVal(p)
          scrollToTop()
        }
        setSortAndClose = val => {
          setSort(val)
          setSortMenuVisible(false)
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
  if(sort == 'name') {
    filtered = filtered.sort((a, b) => {
      a = a.name
      b = b.name
      return a < b ? -1 : b < a ? 1 : 0
    })
  }
  if(sort == 'code') {
    filtered = filtered.sort((a, b) => {
      a = a.code
      b = b.code
      return a < b ? -1 : b < a ? 1 : 0
    })
  }
  return (
    <View style={{padding: 20}}>
      <Headline style={{paddingBottom: 20}}>Characters</Headline>
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
  ({mods, characters, config}) => ({mods, characters, config})
)(Mods)